const { textIncludes } = require('./find');
const { sendMessage, sendImage } = require('./send');
const { allTacos, lastMonthsTacos } = require('./database');
const { getMembers } = require('./get');
const { countTacosByUser } = require('./utils');

function leaderboardText(users, period) {
  let leaderboard = `Here's the ${period || ''} :taco: leaderboard\n\`\`\``;
  users.forEach((user) => {
    let name = user.name;
    if (user.name === 'taco') {
      name = 'tacobot';
    }
    leaderboard += `\n@${name.padEnd(20)} ${user.score}`;
  });
  leaderboard += '\n```';
  return leaderboard;
}

module.exports.mentions = [
  (text, channel) => {
    if (textIncludes(text, [/leaderboard/g])) {
      if (textIncludes(text, [/all/g, /all time/g])) {
        Promise.all([allTacos(), getMembers()]).then(([tacos, members]) => {
          const users = countTacosByUser(members, tacos);
          const msg = leaderboardText(users, 'all time');
          sendMessage(channel, msg);
        });
      } else if (textIncludes(text, [/last month/g])) {
        Promise.all([lastMonthsTacos(), getMembers()]).then(
          ([tacos, members]) => {
            const users = countTacosByUser(members, tacos);
            const msg = leaderboardText(users, "previous month's");
            sendMessage(channel, msg);
          }
        );
      }
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
      sendMessage(
        channel,
        `:game_die: *${Math.ceil(Math.random() * 6)}* :game_die:`
      );
    }
  }
];
