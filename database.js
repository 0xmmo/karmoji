const dburl = process.env.MONGODB_URI;

const mongo = require("mongoskin");
const db = mongo.db(dburl, { native_parser: true });

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
        time: { $gte: start },
      })
      .toArray((err, result) => {
        if (err) throw err;
        callback(result);
      });
  },
};

module.exports.add = {
  taco: function(channel, userFrom, userTo, callback) {
    base.addEntryToCollection(
      "tacos",
      {
        userFrom,
        userTo,
        channel,
        time: new Date(),
      },
      callback
    );
  },
};

module.exports.get = (collection) => ({
  all: () => ({
    do: function(callback) {
      base.getAllFromCollection(collection, callback);
    },
  }),
  days: (days) => ({
    do: function(callback) {
      const start = new Date(new Date() - days * 60 * 60 * 24 * 1000);
      base.getPeriodFromCollection(collection, start, callback);
    },
  }),
});
