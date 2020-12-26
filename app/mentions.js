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
  (text, channel) => {
    if (textIncludes(text, [/leaderboard/g])) {
      sendMessage(
        channel,
        'Apologies, but the leaderboard is currently disabled!'
      );
    }
  },
  (text, channel) => {
    if (textIncludes(text, [/make it rain/g])) {
      sendImage(
        channel,
        'https://media.giphy.com/media/pYCdxGyLFSwgw/giphy.gif'
      );
    }
  },

  (text, channel) => {
    if (textIncludes(text, [/dance/g])) {
      sendImage(
        channel,
        'https://media.giphy.com/media/b5WqMx1eiFv6U/giphy.gif'
      );
    }
  },
  (text, channel) => {
    if (
      textIncludes(text, [/good bot/g, /thanks/g, /thank you/g, /:niiice:/g])
    ) {
      sendMessage(channel, ':yey:');
    }
  },
  (text, channel) => {
    if (textIncludes(text, [/bad bot/g, /:oldmanyellsat:/g])) {
      sendMessage(channel, ':sadpanda:');
    }
  },
  (text, channel) => {
    if (
      textIncludes(text, [/roll die/g, /roll a die/g, /dice/g, /:game_die:/g])
    ) {
      const text = `:game_die: *${Math.ceil(Math.random() * 6)}* :game_die:`;
      sendMessage(channel, text);
    }
  }
];