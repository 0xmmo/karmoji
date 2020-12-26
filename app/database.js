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
  return Taco.find().exec();
};

function firstOfMonth(month, year) {
  const date = new Date();
  date.setFullYear(year);
  date.setDate(1);
  date.setMonth(month);
  date.setFullYear(year);
  return date;
}

function startAndEndDates() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const start = firstOfMonth(previousMonth, previousYear);
  const end = firstOfMonth(currentMonth, currentYear);
  return {
    start,
    end
  };
}

module.exports.lastMonthsTacos = function lastMonthsTacos() {
  const { start, end } = startAndEndDates();
  return Taco.find({
    time: {
      $gte: start,
      $lt: end
    }
  }).exec();
};

// module.exports.get = (collection) => ({
//   days: (days) => ({
//     do: function(callback) {
//       const start = new Date(new Date() - days * 60 * 60 * 24 * 1000);
//       base.getPeriodFromCollection(collection, start, callback);
//     }
//   })
// });
