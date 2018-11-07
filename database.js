const dburl = process.env.MONGODB_URI;

const mongo = require('mongoskin');
const db = mongo.db(dburl,{native_parser:true});

module.exports.addTaco = (userFrom, userTo, channel, callback) => {
	db
	.collection('tacos')
	.insert({
		userFrom,
		userTo,
		channel,
		time: new Date(),
	}, (err,result)=>{
		if(err) throw err;
		callback(result);
	});
}

module.exports.getAllTacosByUser = (callback) => {
	db
	.collection('tacos')
	.find()
	.toArray((err, result) => {
		if(err) throw err;
		callback(result);
	});
}