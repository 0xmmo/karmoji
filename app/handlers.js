const { markResponded } = require('./events');
const { mentionedUsers } = require('./find');
const { mentions } = require('./mentions');
const { messages } = require('./messages');

module.exports.handleMessage = function handleMessage(event) {
  const { text, channel, user, ts } = event;
  const users = mentionedUsers(text);
  if (users.length) {
    for (const message of messages) {
      message(text, channel, ts, users, user);
    }
    markResponded(event);
  }
};

module.exports.handleMention = function handleMention(event) {
  const { text, channel } = event;
  for (const mention of mentions) {
    mention(text, channel);
  }
  markResponded(event);
};
