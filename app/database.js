const mongoose = require('mongoose');

const { Taco } = require('./models/taco');

const password = process.env.ATLAS_PASSWORD;
const username = process.env.ATLAS_USERNAME;
const dburl = process.env.ATLAS_URI;

module.exports.connectDatabase = function connectDatabase() {
  mongoose.connect(
    dburl,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      auth: {
        user: username,
        password
      }
    }
  );
};

// const base = {
//   addEntryToCollection: function(collection, entry, callback) {
//     db.collection(collection).insert(entry, (err, result) => {
//       if (err) throw err;
//       callback(result);
//     });
//   },
//   getAllFromCollection: function(collection, callback) {
//     db.collection(collection)
//       .find()
//       .toArray((err, result) => {
//         if (err) throw err;
//         callback(result);
//       });
//   },
//   getPeriodFromCollection: function(collection, start, callback) {
//     db.collection(collection)
//       .find({
//         time: { $gte: start }
//       })
//       .toArray((err, result) => {
//         if (err) throw err;
//         callback(result);
//       });
//   }
// };

module.exports.giveTaco = function giveTaco(channel, userFrom, userTo) {
  const taco = new Taco({
    userFrom,
    userTo,
    channel,
    time: new Date()
  });
  taco.save();
};

module.exports.allTacos = function allTacos() {
  Taco.find().then((docs) => {
    console.log({ docs });
  });
};

// module.exports.get = (collection) => ({
//   all: () => ({
//     do: function(callback) {
//       base.getAllFromCollection(collection, callback);
//     }
//   }),
//   days: (days) => ({
//     do: function(callback) {
//       const start = new Date(new Date() - days * 60 * 60 * 24 * 1000);
//       base.getPeriodFromCollection(collection, start, callback);
//     }
//   })
// });
