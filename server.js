const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');
const { sendMail } = require('./mailer');
const mongoose = require('mongoose');
var { Users } = require('./models/Users');
var { GroupList } = require('./models/GroupList');
var { Notification } = require('./models/Notifications');
var { Wing } = require('./models/Wing');
var { Timer } = require('./models/Timer');
var connection = require('./config.js').mongooseConnection;
require('./passport-config');

var app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieSession({
	name: 'auth',
	keys: ['key1', 'key2']
}))
app.use(passport.initialize());
app.use(passport.session());

mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
let DATABASE_CONNECTION = connection;

mongoose.connect(DATABASE_CONNECTION, { useNewUrlParser: true });

app.get("/getGroup", (req, res) => {
	GroupList.find(function (err, finalgrps) {
		if (err) {
			console.log(err);
		}
		else {
			res.json(finalgrps);
			// console.log(finalgrps);
		}

	})
});
app.get("/getUsers", (req, res) => {
	Users.find(function (err, allUsers) {
		if (err) {
			console.log(err);
		}
		else {
			res.json(allUsers);
		}

	})
});

app.get("/getWing", (req, res) => {
	Wing.find(function (err, allWings) {
		if (err) {
			console.log(err);
			res.json(err);
		}
		else {
			res.json(allWings);
			console.log(allWings);
		}
	})
});

app.post("/signIn", (req, res) => {
	var { username, password } = req.body;

	Users.findOne({ username: username }, async (err, result) => {
		if (err)
			res.send(err);
		if (await bcrypt.compare(password, result.password))
			res.send(result);
		console.log(result);
	});
});

async function createUser(user) {
	await Users.create(user, (err, obj) => {
		if (err) {
			console.log(err);
			// res.send({ status: false, error: err })
			return {
				status: false, 
				error: err
			}
		}
		else {
			sendMail('Registered Successfully!', '🎉', user.email).then(result=>console.log(result))
				.catch(err => console.log(err));
			// res.send(obj);
			return obj;
		}
	});
}

app.post("/register", async (req, res) => {
	var { name, username, email, password, leader, member } = req.body;
	const hashedPassword = await bcrypt.hash(password, 10);
	console.log(hashedPassword)
	var user = { 
		name: name, 
		username: username, 
		email: email, 
		password: hashedPassword, 
		leader: leader, 
		member: member, 
		wing: "null" 
	}
	createUser(user)
		.then(result => {
			console.log(result)
			res.status(201).send({
				name: user.name,
				user: user.username,
				email: user.email
			})
		})
		.catch (err => console.log(err)) 
});

app.post("/getRole", (req, res) => {
	var { username } = req.body;
	Users.findOne({ username: username }, (err, obj) => {
		if (err) {
			console.log(err);
			res.status(404).json(err);
		}
		else
			res.send(obj);
	});
});

app.post("/setLeader", (req, res) => {
	const { username } = req.body;
	console.log('username is', username);
	Users.findOneAndUpdate({ username: username }, { $set: { gname: username } }, { new: true }, (err, obj) => {
		if (err)
			res.status(404).json(err);
		else {
			Users.findOneAndUpdate({ username: username }, { $set: { leader: true } }, { new: true }, (err, obj) => {
				if (err)
					res.status(404).json(err);
				else
					var group = {
						gname: username,
						member: 1,
						grpid: obj._id,
					}
				GroupList.create(group, (error, object) => {
					if (error)
						res.status(404).json(error);
					else
						res.json(object);
				});
			})
			sendMail('Role Updated to Group Leader', '', obj.email)
		}
	}
	);
});

app.post("/setMember", (req, res) => {
	const { username } = req.body
	console.log('username is', username)
	Users.findOneAndUpdate({ username: username }, { $set: { member: true } }, { new: true }, (err, obj) => {
		if (err)
			res.status(404).json(err)
		else{
			sendMail('Role Updated to Group Leader', '', obj.email)
			res.json(obj)
		}
	});
});


app.post("/createNotif", (req, res) => {
	const { fromGname, toUsername, fromUsername, toGname } = req.body
	var notif = { fromgname: fromGname, tousername: toUsername, fromusername: fromUsername, togname: toGname }
	Notification.find(notif, (err, obj) => {
		if (err)
			res.status(404).json(err);
		else {
			if (obj.length === 0) {
				Notification.create(notif, (error, object) => {
					if (error)
						res.status(404).json(error);
					else{
						if(fromGname===null){
							Users.findOne({username: toGname},(err,user)=>{
								sendMail(`${fromUsername} requested to join your group!`, '😃', user.email)
							})
						}
						else{
							Users.findOne({username: toUsername},(err,user)=>{
								sendMail(`${fromGname} wants to add you in their group!`, '😃', user.email)
							})
						}
						res.json(object)
					}
				})
			}
			else {
				res.status(200).json({
					code: 123,
					message: 'Notif already exists',
				})
			}
		}
	})
});

app.post("/getNotifsformember", (req, res) => {
	var { username } = req.body;
	// console.log('username is',username);
	Notification.find({ tousername: username }, (err, obj) => {
		if (err)
			res.status(404).json(err);
		else {
			console.log(obj)
			res.json(obj);
		}
	});
});

app.post("/getNotifsforLeader", (req, res) => {
	var { username } = req.body;
	// console.log('username is',username);
	Notification.find({ togname: username }, (err, obj) => {
		if (err)
			res.status(404).json(err);
		else
			res.json(obj);
	});
});

app.post("/getUsers", (req, res) => {
	var { leader } = req.body;
	Users.find({ leader: leader }, (err, obj) => {
		if (err)
			res.status(404).json(err);
		else
			res.json(obj);
	});
});

app.post("/getGroups", (req, res) => {
	var { gname, grpid, members, color } = req.body;
	var grp = { gname: gname, grpid: grpid, members: members, color: color };
	GroupList.create(grp, (err, obj) => {
		if (err)
			res.status(404).json(err);
		else
			res.json(obj);
	});
});

app.post("/getOneUser", (req, res) => {
	var { username } = req.body;
	Users.find({ username: username }, (err, obj) => {
		if (err)
			res.status(404).json(err);
		else
			res.json(obj);
	});
});

app.post("/setSelected", (req, res) => {
	var { bhawan, floor, wingNo } = req.body;
	console.log(bhawan, wingNo, floor);
	Wing.findOneAndUpdate({ bhawan: bhawan, floor: floor, wingNo: wingNo }, { $set: { status: "selected" } }, { new: true }, (err, obj) => {
		console.log(obj);
		if (err)
			res.status(404).json(err);
		else
			res.json(obj);
	})
})

app.post("/selectWing", (req, res) => {
	var { wing, user } = req.body;
	console.log("hiii" + wing + user);
	Users.findOneAndUpdate({ username: user }, { $set: { wing: wing } }, (err, obj) => {
		console.log(obj);
		if (err)
			res.status(404).json(err);
		else
			res.json(obj);
	})
})

app.post("/setBlocked", (req, res) => {
	var { bhawan, floor, wingNo } = req.body;
	Wing.findOneAndUpdate({ bhawan: bhawan, floor: floor, wingNo: wingNo }, { $set: { status: "blocked" } }, { new: true }, (err, obj) => {
		console.log(obj);
		if (err)
			res.status(404).json(err);
		else
			res.json(obj);
	})
})

app.post("/setFree", (req, res) => {
	var { bhawan, floor, wingNo } = req.body;
	Wing.findOneAndUpdate({ bhawan: bhawan, floor: floor, wingNo: wingNo }, { $set: { status: "free" } }, { new: true }, (err, obj) => {
		console.log(obj);
		if (err)
			res.status(404).json(err);
		else
			res.json(obj);
	})
})

app.post("/notifsReq", (req, res) => {
	var { fromGname, toUsername, fromUsername, toGname, accept } = req.body;
	console.log('fromGname', fromGname)
	if (fromGname !== undefined && toUsername !== undefined) {
		if (accept === true) {
			Notification.findOneAndUpdate({ fromgname: fromGname, tousername: toUsername }, { $set: { colour: "#00ff00", disabled: true } }, { new: true }, (err, obj) => {
				console.log(obj);
			})
			Users.findOneAndUpdate({ username: toUsername }, { $set: { gname: fromGname } }, { new: true }, (err, obj) => {
				console.log(obj);
				if (err)
					res.status(404).json(err);
				else
					res.json(obj);
			})
		}
		else {
			Notification.findOneAndUpdate({ fromgname: fromGname, tousername: toUsername }, { $set: { colour: "#dc143c", disabled: true } }, { new: true }, (err, obj) => {
				console.log(obj);
				if (err)
					res.status(404).json(err);
				else
					res.json(obj);
			})
		}
	}
	else
		if (fromUsername !== undefined && toGname !== undefined) {
			if (accept === true) {
				Notification.findOneAndUpdate({ fromusername: fromUsername, togname: toGname }, { $set: { colour: "#00ff00", disabled: true } }, { new: true }, (err, obj) => {
					console.log(obj);
				})
				Users.findOneAndUpdate({ username: fromUsername }, { $set: { gname: toGname } }, { new: true }, (err, obj) => {
					console.log(obj);
					if (err)
						res.status(404).json(err);
					else
						res.json(obj);
				})
			}
			else {
				Notification.findOneAndUpdate({ fromusername: fromUsername, togname: toGname }, { $set: { colour: "#dc143c", disabled: true } }, { new: true }, (err, obj) => {
					console.log(obj);
					if (err)
						res.status(404).json(err);
					else
						res.json(obj);
				})
			}
		}
})

app.post('/timer', (req, res) => {
	var time = {
		countdown: new Date(),
		updatedAt: new Date(),
		for: 'initial setup',
	}
	Timer.create(time, (err, obj) => {
		if (err)
			res.status(500).json(err);
		else
			res.status(201).json({ id: obj.id });
	})
})

app.get('/timer/:id', (req, res) => {
	var id = req.params.id;
	Timer.findById(id, (err, obj) => {
		if (err)
			res.status(500).json(err);
		else
			res.status(200).json(obj);
	})
})

app.post('/timer/:id', (req, res) => {
	var id = req.params.id;
	var countdown = new Date(req.body.setTime);
	var sprint = req.body.sprint;
	Timer.findByIdAndUpdate(id, {
		countdown: countdown,
		updatedAt: new Date(),
		for: sprint,
	}, (err, obj) => {
		if (err)
			res.status(500).json(err);
		else
			res.json(obj);
	})
})

const isLoggedIn = (req,res,next) => {
	if(req.user)
		next();
	else	
		res.sendStatus(401);
}

app.get('/good', isLoggedIn, (req, res) => {

	res.send(`Logged in as ${req.user}`)
})

app.get('/failed', (req, res) => res.send(`Did not log in`))

app.get('/google',
	passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback',
	passport.authenticate('google', { failureRedirect: '/failed' }),
	function (req,res) {
		// Successful authentication, redirect home.
		console.log(req.user);
		// res.redirect('/good');
		res.send(`Logged in as ${req.user.displayName}`)
	});

app.get('/logout', (req,res) => {
	req.session=null;
	req.logOut();
	res.redirect('/');
})

app.get('/', (req, res) => {
	res.status(200).json('Server is up and running')
})
process.env.PORT = 5000
app.listen(process.env.PORT || 5000, () => {
	console.log(`listening on port ${process.env.PORT}`);
});