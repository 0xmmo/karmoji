const { sendReaction, sendImage } = require('./send');
const { textIncludes } = require('./find');
const { shuffle } = require('./utils');
const { giveTaco } = require('./database');

function uniqueMentions(users, sender) {
  const mentionedUsers = new Set(users);
  if (mentionedUsers.has(sender)) {
    mentionedUsers.delete(sender);
  }
  return Array.from(mentionedUsers);
}

module.exports.messages = [
  // tacos
  (text, channel, messageTimestamp, users, userFrom) => {
    if (!textIncludes(text, [/:taco:/g])) {
      return;
    }

    const mentions = uniqueMentions(users, userFrom);
    for (const user of mentions) {
      giveTaco(channel, userFrom, user);
    }

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
    const count = mentions.length;

    for (let i = 0; i < count; i++) {
      const emoji = emojis[i % emojis.length];
      sendReaction(channel, messageTimestamp, emoji);
    }

    if (count > 3) {
      sendImage(channel, 'https://i.imgur.com/4Ldx8uf.jpg');
    }
  },
  // negatacos
  (text, channel, messageTimestamp) => {
    if (textIncludes(text, [/:negataco:/g])) {
      const emojis = ['notsureif', 'coneofshame', 'wat', 'wutlol'];
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      sendReaction(channel, messageTimestamp, emoji);
    }
  }
];
