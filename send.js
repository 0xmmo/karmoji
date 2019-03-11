const {WebClient} = require('@slack/client');
const pad = require('pad');

const token = process.env.SLACK_BOT_TOKEN;
const web = new WebClient(token);

const message = function(channel, text) {
  return web.chat
    .postMessage({
      channel,
      text
    })
    .catch(console.error);
};

const image = function(channel, url) {
  return web.chat
    .postMessage({
      channel,
      attachments: [
        {
          fallback: '',
          image_url: url
        }
      ]
    })
    .catch(console.error);
};

module.exports.confirmation = {
  taco: function(channel, userFrom, userTo) {
    const text = `<@${userTo}> received a :taco: from <@${userFrom}>`;
    return message(channel, text);
  }
};

module.exports.leaderboard = function(channel, users, period) {
  let leaderboard = `Here's the ${period || ''} :taco: leaderboard\n\`\`\``;
  users.forEach((user) => {
    let name = user.name;
    if (user.name === 'taco') name = 'tacorico';
    leaderboard += `\n@${pad(name, 20)} ${user.score}`;
  });
  leaderboard += '\n```';
  return message(channel, leaderboard);
};

module.exports.reaction = {
  rain: function(channel) {
    const url = 'https://media.giphy.com/media/pYCdxGyLFSwgw/giphy.gif';
    return image(channel, url);
  },
  dance: function(channel) {
    const url = 'https://media.giphy.com/media/b5WqMx1eiFv6U/giphy.gif';
    return image(channel, url);
  },
  yey: function(channel) {
    const text = ':yey:';
    return message(channel, text);
  },
  sadpanda: function(channel) {
    const text = ':sadpanda:';
    return message(channel, text);
  },
  everyone: function(channel) {
    const url = 'https://i.imgur.com/4Ldx8uf.jpg';
    return image(channel, url);
  }
};