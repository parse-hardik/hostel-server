var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name:{type:String,required:true,unique:false},
	username:{type:String,required:true,unique:true},
	email:{type:String,required:true,unique:true},
	password:{type:String,required:true,unique:false},
	leader:Boolean,
	member:Boolean,
});

const Users = mongoose.model("Users",UserSchema);

module.exports={Users:Users};