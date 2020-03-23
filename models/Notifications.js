var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NotificationSchema = new Schema({
	fromgname:{type:String,unique:false},
	tousername:{type:String,unique:false}
});

const Notification = mongoose.model("Notification",NotificationSchema);

module.exports={Notification:Notification};