const { WebClient } = require('@slack/web-api');

const token = process.env.SLACK_BOT_TOKEN;
const web = new WebClient(token);

module.exports.members = function(limit) {
  return web.users.list({ limit }).catch(console.error);
};
