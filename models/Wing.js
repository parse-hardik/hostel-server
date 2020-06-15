var mongoose = require('mongoose');
var Schema =mongoose.Schema;
 
var WingSchema =new Schema ({
	wingId : {type:String  ,unique:true,required:true},
	bhawan : {type:String ,unique:false,required:true},
	floor : {type:String,unique:false, required:true},
	status :{type:String,unique:false, required:true },
	wingNo : {type:String ,unique:false,required:true},

})
const Wing = mongoose.model("Wing",WingSchema);

module.exports={Wing:Wing};