const dburl = process.env.MONGODB_URI || 'mongodb://heroku_fvmq0dvq:uk6l4q60pmv149b9omk541s7n3@ds253713.mlab.com:53713/heroku_fvmq0dvq';

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