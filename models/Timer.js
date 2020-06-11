var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TimerSchema = new Schema({
	countdown: {type:Date, required:true},
	updatedAt: {type:Date, required:true},
});

const Timer = mongoose.model("Timer", TimerSchema);

module.exports = { Timer: Timer };