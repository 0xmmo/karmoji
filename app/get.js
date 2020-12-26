const { web } = require('./web');

module.exports.getMembers = function(limit = 1000) {
  return web.users
    .list({ limit })
    .then((response) => response.members, console.error);
};

module.exports.getBotUserId = function getBotUserId() {
  return web.auth.test().then((response) => response.user_id);
};
