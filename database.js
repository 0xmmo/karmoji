const dburl = process.env.MONGODB_URI;

const mongo = require('mongoskin');
const db = mongo.db(dburl, {native_parser: true});

const base = {
  addEntryToCollection: function(collection, entry, callback) {
    db.collection(collection).insert(entry, (err, result) => {
      if (err) throw err;
      callback(result);
    });
  },
  getAllFromCollection: function(collection, callback) {
    db.collection(collection)
      .find()
      .toArray((err, result) => {
        if (err) throw err;
        callback(result);
      });
  }
};

module.exports.add = {
  taco: function(channel, userFrom, userTo, callback) {
    base.addEntryToCollection(
      'tacos',
      {
        userFrom,
        userTo,
        channel,
        time: new Date()
      },
      callback
    );
  }
};

module.exports.get = {
  all: {
    tacos: function(callback) {
      base.getAllFromCollection('tacos', callback);
    }
  }
};