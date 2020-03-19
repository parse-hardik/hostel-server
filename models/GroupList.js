var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GroupSchema = new Schema({
	grpid:{type:String,required:true,unique:true},
	gname:{type:String,required:true,unique:true},
	members:Number,
	color:String,
});

const GroupList = mongoose.model("GroupList",GroupSchema);

module.exports={GroupList:GroupList};