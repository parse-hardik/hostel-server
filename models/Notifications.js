var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotificationSchema = new Schema({
	date:{type:Date,default:Date.now},
	fromgname:{type:String,unique:false,default:null},
	tousername:{type:String,unique:false,default:null},
	fromusername:{type:String,unique:false,default:null},
	togname:{type:String,unique:false,default:null},
	colour:{type:String,default:white}
});

NotificationSchema.index({ fromgname: 1, tousername: 1 }, { unique: true })
NotificationSchema.index({ fromusername: 1, togname: 1 }, { unique: true })

const Notification = mongoose.model("Notification",NotificationSchema);

module.exports={Notification:Notification};