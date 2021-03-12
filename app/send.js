const { web } = require('./web');

module.exports.sendMessage = function sendMessage(channel, text) {
  return web.chat
    .postMessage({
      channel,
      text
    })
    .catch(console.error);
};

module.exports.sendImage = function sendImage(channel, url) {
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

function sendReaction(channel, messageTimestamp, emoji) {
  return web.reactions
    .add({
      channel,
      timestamp: messageTimestamp,
      name: emoji
    })
    .catch(console.error);
}

module.exports.sendReaction = sendReaction;

function chainReact(channel, messageTimestamp, emojis) {
  const [current, ...rest] = emojis;
  return sendReaction(channel, messageTimestamp, current).then(({ ok }) => {
    if (ok) {
      return chainReact(channel, messageTimestamp, rest);
    }
    return null;
  });
}

module.exports.sendReactions = function sendReactions(
  channel,
  messageTimestamp,
  emojis
) {
  chainReact(channel, messageTimestamp, emojis);
};
