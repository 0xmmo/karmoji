const { WebClient } = require('@slack/client');
const pad = require('pad');
const _ = require('lodash');

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

const reaction = function(channel, messageTimestamp, emoji) {
  return web.reactions
    .add({
      channel,
      timestamp: messageTimestamp,
      name: emoji
    })
    .catch(console.error);
};

module.exports.confirmation = {
  emojis: _.shuffle([
    'ok_hand',
    'fire',
    'thumbsup',
    'boom',
    'tada',
    'heart_eyes',
    'star-struck',
    'muscle',
    'clap',
    'raised_hands',
    'rocket',
    'dark_sunglasses',
    'confetti_ball',
    'gift',
    'trophy',
    'mega'
  ]),
  index: 0,
  reaction(channel, messageTimestamp) {
    const emoji = this.emojis[this.index % this.emojis.length];
    this.index += 1;
    return reaction(channel, messageTimestamp, emoji);
  }
};

module.exports.negatacoConfirmation = function negatacoConfirmation(
  channel,
  messageTimestamp
) {
  const emojis = ['notsureif', 'coneofshame', 'wat', 'wutlol'];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  return reaction(channel, messageTimestamp, emoji);
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

module.exports.response = {
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
  },
  dice: function(channel) {
    const text = `:game_die: *${Math.ceil(Math.random() * 6)}* :game_die:`;
    return message(channel, text);
  }
};
