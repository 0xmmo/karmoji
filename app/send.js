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

module.exports.sendReaction = function sendReaction(
  channel,
  messageTimestamp,
  emoji
) {
  return web.reactions
    .add({
      channel,
      timestamp: messageTimestamp,
      name: emoji
    })
    .catch(console.error);
};
