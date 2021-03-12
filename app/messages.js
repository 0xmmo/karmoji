const { sendReaction, sendReactions, sendImage } = require('./send');
const { textIncludes } = require('./find');
const { shuffle } = require('./utils');
const { giveTaco } = require('./database');
const { TACO_EMOJIS, NEGATACO_PHRASES } = require('./constants');

function uniqueMentions(users, sender) {
  const mentionedUsers = new Set(users);
  if (mentionedUsers.has(sender)) {
    mentionedUsers.delete(sender);
  }
  return Array.from(mentionedUsers);
}

function createTacoGiver(users) {
  const givenTo = {};
  for (const user of users) {
    givenTo[user] = 1;
  }
  return {
    spams: 0,
    givenTo
  };
}

const TACO_GIVERS = {};

function logTacos(tacoState, users) {
  let overTheLimit = false;
  for (const user of users) {
    if (user in tacoState.givenTo) {
      tacoState.givenTo[user]++;
      if (tacoState.givenTo[user] > 5) {
        overTheLimit = true;
      }
    } else {
      tacoState.givenTo[user] = 1;
    }
  }
  if (overTheLimit) {
    tacoState.spams++;
  }
  return overTheLimit;
}

function trackTacos(userFrom, users) {
  let tacoState = TACO_GIVERS[userFrom];
  let exceedsLimits = false;
  if (tacoState) {
    exceedsLimits = logTacos(tacoState, users);
  } else {
    tacoState = createTacoGiver(users);
    TACO_GIVERS[userFrom] = tacoState;
  }
  // allow tacos if no user is over the limit
  return exceedsLimits ? tacoState.spams : 0;
}

function resetTracking() {
  for (const key in TACO_GIVERS) {
    if (TACO_GIVERS.hasOwnProperty(key)) {
      Reflect.deleteProperty(TACO_GIVERS, key);
    }
  }
}

// reset taco tracking every 24 hours
const ONE_DAY = 24 * 60 * 60 * 1000;
setInterval(resetTracking, ONE_DAY);

function selectTacoEmojis(count) {
  const emojis = shuffle(TACO_EMOJIS.slice());
  return emojis.slice(0, count);
}

module.exports.messages = [
  // tacos
  (text, channel, messageTimestamp, users, userFrom) => {
    if (!textIncludes(text, [/:taco:/g])) {
      return;
    }

    const mentions = uniqueMentions(users, userFrom);

    const spams = trackTacos(userFrom, users);
    if (spams > 0) {
      sendReaction(channel, messageTimestamp, 'taco-jon');
      return;
    }

    for (const user of mentions) {
      giveTaco(channel, userFrom, user);
    }

    const count = mentions.length;

    if (count > 3) {
      sendReaction(channel, messageTimestamp, 'tacopalooza');
      sendImage(channel, 'https://i.imgur.com/4Ldx8uf.jpg');
    }

    const emojis = selectTacoEmojis(count);
    sendReactions(channel, messageTimestamp, emojis);
  },
  // negatacos
  (text, channel, messageTimestamp) => {
    if (textIncludes(text, [/:negataco:/g])) {
      const emojis = NEGATACO_PHRASES;
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      sendReactions(channel, messageTimestamp, emoji);
    }
  }
];
