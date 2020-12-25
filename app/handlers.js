const { markResponded } = require('./events');
const { sendReaction, sendImage } = require('./send');
const { mentionedUsers, textIncludes } = require('./find');
const { mentions } = require('./mentions');
const { shuffle } = require('./utils');

function uniqueMentions(users, sender) {
  const mentionedUsers = new Set(users);
  if (mentionedUsers.has(sender)) {
    mentionedUsers.delete(sender);
  }
  return Array.from(mentionedUsers);
}

function hasNegatacos(text) {
  return textIncludes(text, [/:negataco:/g]);
}

function negatacoConfirmation(channel, messageTimestamp) {
  const emojis = ['notsureif', 'coneofshame', 'wat', 'wutlol'];
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  return sendReaction(channel, messageTimestamp, emoji);
}

function hasTacos(text) {
  return textIncludes(text, [/:taco:/g]);
}

function tacoConfirmation(channel, messageTimestamp, count) {
  const emojis = shuffle([
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
  ]);
  for (let i = 0; i < count; i++) {
    const emoji = emojis[i % emojis.length];
    sendReaction(channel, messageTimestamp, emoji);
  }

  if (count > 3) {
    sendImage(channel, 'https://i.imgur.com/4Ldx8uf.jpg');
  }
}

module.exports.handleMessage = function handleMessage(event) {
  const { text, channel, user: userFrom, ts } = event;

  const users = mentionedUsers(text);

  if (users.length) {
    if (hasTacos(text)) {
      const mentions = uniqueMentions(users, userFrom);
      tacoConfirmation(channel, ts, mentions.length);
    }

    if (hasNegatacos(text)) {
      negatacoConfirmation(channel, ts);
    }
    markResponded(event);
  }
};

module.exports.handleMention = function handleMention(event) {
  const { text, channel } = event;

  for (const mention of mentions) {
    if (mention.existsIn(text)) {
      mention.respond(channel);
    }
  }

  markResponded(event);
};
