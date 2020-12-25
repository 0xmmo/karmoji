const { textIncludes } = require('./find');
const { sendMessage, sendImage } = require('./send');

// commented out until database exists again
// module.exports.all = function(text) {
//   return textIncludes(text, [/all/g, /all time/g]);
// };

// module.exports.year = function(text) {
//   return textIncludes(text, [/year/g]);
// };

// module.exports.week = function(text) {
//   return textIncludes(text, [/week/g]);
// };

module.exports.mentions = [
  {
    existsIn(text) {
      return textIncludes(text, [/leaderboard/g]);
    },
    respond(channel) {
      return sendMessage(
        channel,
        'Apologies, but the leaderboard is currently disabled!'
      );
    }
  },
  {
    existsIn(text) {
      return textIncludes(text, [/make it rain/g]);
    },
    respond(channel) {
      return sendImage(
        channel,
        'https://media.giphy.com/media/pYCdxGyLFSwgw/giphy.gif'
      );
    }
  },
  {
    existsIn(text) {
      return textIncludes(text, [/dance/g]);
    },
    respond(channel) {
      return sendImage(
        channel,
        'https://media.giphy.com/media/b5WqMx1eiFv6U/giphy.gif'
      );
    }
  },
  {
    existsIn(text) {
      return textIncludes(text, [
        /good bot/g,
        /thanks/g,
        /thank you/g,
        /:niiice:/g
      ]);
    },
    respond(channel) {
      return sendMessage(channel, ':yey:');
    }
  },
  {
    existsIn(text) {
      return textIncludes(text, [/bad bot/g, /:oldmanyellsat:/g]);
    },
    respond(channel) {
      return sendMessage(channel, ':sadpanda:');
    }
  },
  {
    existsIn(text) {
      return textIncludes(text, [
        /roll die/g,
        /roll a die/g,
        /dice/g,
        /:game_die:/g
      ]);
    },
    respond(channel) {
      const text = `:game_die: *${Math.ceil(Math.random() * 6)}* :game_die:`;
      return sendMessage(channel, text);
    }
  }
];
