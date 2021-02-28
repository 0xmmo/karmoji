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

module.exports.sendReactions = function sendReactions(
  channel,
  messageTimestamp,
  emojis
) {
  for (let i = 0; i < emojis.length; i++) {
    setTimeout(() => {
      sendReaction(channel, messageTimestamp, emojis[i]);
    }, i * 10);
  }
};

module.exports.sendEphemeral = function sendEphemeral(channel, user, text) {
  return web.chat
    .postEphemeral({
      channel,
      user,
      text
    })
    .catch(console.error);
};
