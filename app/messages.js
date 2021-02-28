const {
  sendReaction,
  sendImage,
  sendMessage,
  sendEphemeral
} = require('./send');
const { textIncludes } = require('./find');
const { shuffle, emojify } = require('./utils');
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

function spamReaction(channel, user, messageTimestamp, spams) {
  switch (spams) {
    case 1:
      sendReaction(channel, messageTimestamp, emojify('hand'));
      break;
    case 2:
      sendReaction(channel, messageTimestamp, emojify('?'));
      break;
    case 3:
      sendReaction(channel, messageTimestamp, emojify('thinking_face'));
      break;
    case 4:
      sendReaction(channel, messageTimestamp, emojify('??'));
      break;
    case 5:
      sendReaction(channel, messageTimestamp, emojify('um'));
      break;
    case 6:
      sendMessage(channel, 'BTW, I stop counting at 5 tacos a day per person');
      break;
    case 7:
      sendImage(
        channel,
        'https://media0.giphy.com/media/zCfeMBYXjY9yM/giphy.gif'
      );
      break;
    case 8:
      sendEphemeral(
        channel,
        user,
        'I have created a new emoji just for this situation, though. Would you like to see it?'
      );
      break;
    case 9:
      sendEphemeral(channel, user, ':taco-jon:');
      break;
    case 10:
      sendEphemeral(channel, user, 'Pretty cool, right?');
      break;
    default:
      sendReaction(channel, messageTimestamp, 'taco-jon');
  }
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
      spamReaction(channel, userFrom, messageTimestamp, spams);
      return;
    }

    for (const user of mentions) {
      giveTaco(channel, userFrom, user);
    }

    const count = mentions.length;
    const emojis = selectTacoEmojis(count);
    for (const emoji of emojis) {
      sendReaction(channel, messageTimestamp, emoji);
    }

    if (count > 3) {
      sendImage(channel, 'https://i.imgur.com/4Ldx8uf.jpg');
    }
  },
  // negatacos
  (text, channel, messageTimestamp) => {
    if (textIncludes(text, [/:negataco:/g])) {
      const emojis = NEGATACO_PHRASES;
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      for (const char of emoji) {
        sendReaction(channel, messageTimestamp, char);
      }
    }
  }
];
