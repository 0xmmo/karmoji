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
  },
  getPeriodFromCollection: function(collection, start, callback) {
    db.collection(collection)
      .find({
        time: {$gte: start}
      })
      .toArray((err, result) => {
        if (err) throw err;
        callback(result);
      });
  },
  removeEntryFromCollection: function(collection, filter, callback) {
    const writeResult = db.collection(collection)
      .remove({ userTo }, true);
    if (writeResult.writeConcernError) {
        callback(writeResult.writeConcernError.errmsg);
    }
  },
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

module.exports.sub = {
  taco: function(channel, userTo, callback) {
    base.removeEntryFromCollection(
       'tacos',
      {
       userTo
      },
       callback
    );
  }
};

module.exports.get = (collection) => ({
  all: () => ({
    do: function(callback) {
      base.getAllFromCollection(collection, callback);
    }
  }),
  days: (days) => ({
    do: function(callback) {
      const start = new Date(new Date() - days * 60 * 60 * 24 * 1000);
      base.getPeriodFromCollection(collection, start, callback);
    }
  })
});
