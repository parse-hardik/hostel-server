var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GroupSchema = new Schema({
	gname:{type:String,required:true,unique:true},
	members:{type:Number,default:1},
	color:{type:String,default:'#e88f17'},
});

const GroupList = mongoose.model("GroupList",GroupSchema);

module.exports={GroupList:GroupList};