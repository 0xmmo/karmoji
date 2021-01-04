const { web } = require('./web');

module.exports.getMembers = function(limit = 1000) {
  return web.users.list({ limit }).then((response) => {
    const members = {};
    for (const member of response.members) {
      members[member.id] = member;
    }
    return members;
  }, console.error);
};

module.exports.getChannels = function(limit = 1000) {
  return web.conversations.list({ limit }).then((response) => {
    const channels = {};
    for (const channel of response.channels) {
      channels[channel.id] = channel;
    }
    return channels;
  }, console.error);
};

module.exports.getBotUserId = function getBotUserId() {
  return web.auth.test().then((response) => response.user_id);
};
