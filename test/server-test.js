'use-strict';

var chai = require('chai');
var chaiHttp = require('chai-http')
var server = require('../server')
var should = chai.should()
var mongoose = require('mongoose');
var Users = require('../models/Users')

mongoose.connect('mongodb+srv://hardik:hardik@cluster0-zs92y.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
        .then(()=>console.log('connected to MongoDB'))
        .catch(err=> console.log(err));

var expect = chai.expect

chai.use(chaiHttp);

describe('Test api', ()=>{

    describe('Endpoint APIs /Get',()=>{
        describe('returns the signIn page /',()=>{
            it('returns correct status',(done)=>{
                chai.request(server)
                    .get('/')
                    .end((err,res)=>{
                        if(err) throw err;
                        res.should.have.status(200);
                        res.should.be.json;
                        res.should.be.an('object')
                        done();
                })
        })
        describe('returns the list of Users GET',function(){
            it('Should List all the Users /Users GET', function(done){
                this.enableTimeouts(false);
                chai.request(server)
                    .get('/getUsers')
                    .end((err,res)=>{
                        res.should.have.status(200);
                        done();
                    })
            })
        })
        // describe('returns the group GET',()=>{
        //     it('Should List the group GET',(done)=>{
        //         chai.request(server)
        //             .get('/getGroup')
        //             .end((err,res)=>{
        //                 res.shoud.have.status(500);
        //                 done();
        //             })
        //     it('resolves', (done) => {
        //         resolvingPromise.then( (result) => {
        //             expect(result).to.equal('promise resolved');
        //         }).then(done, done);
        //         });
        //     })
        // })
    })

    describe('POST /Users',()=>{
        it('Creates a new User', function(done){
            let data ={
                name: "dummy",
                username: "dummy",
                email: "dummy@dummy.net",
                password: "dummy",
                leader: true,
                member: false,
                group: "",
                gname: "null"
            }
            this.enableTimeouts(false);
            chai.request(server)
                .post('/register')
                .send(data)
                .end((err, res)=>{
                    res.should.have.status(200);
                    res.should.be.a('object');
                    done();
                })
            })
        it('Logs in the new user', function(done){
            let data ={
                username: 'dummy',
                password: 'dummy'
            }
            this.enableTimeouts(false);
            chai.request(server)
                .post('/signIn')
                .send(data)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.should.be.a('object');
                    done();
                })
        })
        it('Gets the role of the user /POST',function(done){
            let data={
                username: "dummy"
            }
            this.enableTimeouts(false);
            chai.request(server)
                .post('/getRole')
                .send(data)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.should.be.an('object');
                    done();    
                })
        })

        it('Sets the role Leader of the user /POST',function(done){
            let data={
                username: "dummy"
            }
            this.enableTimeouts(false);
            chai.request(server)
                .post('/setLeader')
                .send(data)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.should.be.an('object');
                    done(); 
                })
        })

        it('Sets the role Member of the user /POST',function(done){
            let data={
                username: "dummy"
            }
            this.enableTimeouts(false);
            chai.request(server)
                .post('/setMember')
                .send(data)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.should.be.an('object');
                    done(); 
                })
        })

        it('Gets the list of users in the leaders wing',function(done){
            let data={
                leader: true
            }
            this.enableTimeouts(false);
            chai.request(server)
                .post('/getUsers')
                .send(data)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.should.be.a('object');
                    done();
                })
            })

        it('Creates a notification from one user to another /POST',function(done){
            let data={
                fromgname:"dummyFg",
                tousername:"toDummy",
                fromusername:"fromDummy",
                togname:"dummytG"
            }
            this.enableTimeouts(false);
            chai.request(server)
                .post('/createNotif')
                .send(data)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.should.be.an('object');
                    done(); 
                })
        })
        
        it('Get Notifications from a user leader for a member /POST',function(done){
            let data={
                tousername: "dummy"
            }
            this.enableTimeouts(false);
            chai.request(server)
                .post('/getNotifsformember')
                .send(data)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.should.be.an('object');
                    done(); 
                })
        })

        it('Get Notifications for a leader /POST',function(done){
            let data={
                tousername: "dummy"
            }
            this.enableTimeouts(false);
            chai.request(server)
                .post('/getNotifsforLeader')
                .send(data)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.should.be.an('object');
                    done(); 
                })
        })

        // it('Gets the list of the Groups formed uptil now',function(done){
        //     let data={
        //         gname: "dummy",
        //         grpid: 110,
        //         members: "dummy",
        //         color: "dummy"
        //     }
        //     this.enableTimeouts(false);
        //     chai.request(server)
        //         .post('/getGroups')
        //         .send(data)
        //         .end((err,res)=>{
        //             res.should.have.status(200);
        //             res.should.be.a('object');
        //             done();
        //         })
        //     })
        it('returns one User /POST',function(done){
            let data={
                username: "dummy"
            }
            this.enableTimeouts(false);
            chai.request(server)
                .post('/getOneUser')
                .send(data)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.should.be.a('object');
                    done();
                })
        })

        /*it('shows which wing the group has selected',function(done){
            let data={
                bhawan:"dummyBhawan",
                floor: 1,
                wingNo: 1
            }
            this.enableTimeouts(false);
            chai.request(server)
                .post('/setSelected')
                .send(data)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.should.be.an('object');
                    done
                })
        })

        it('shows which wings are already blocked',function(done){
            let data={
                bhawan:"dummyBhawan",
                floor: 1,
                wingNo: 1
            }
            this.enableTimeouts(false);
            chai.request(server)
                .post('/setBlocked')
                .send(data)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.should.be.an('object');
                    done
                })
        })

        it('shows which Bhawans you want to be free ',function(done){
            let data={
                bhawan:"dummyBhawan",
                floor: 1,
                wingNo: 1
            }
            this.enableTimeouts(false);
            chai.request(server)
                .post('/setFree')
                .send(data)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.should.be.an('object');
                    done
                })
        })
        */

        })
    })  
})
