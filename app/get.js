const { web } = require('./web');

module.exports.members = function(limit) {
  return web.users.list({ limit }).catch(console.error);
};
