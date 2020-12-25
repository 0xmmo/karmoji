const { WebClient } = require('@slack/web-api');

const token = process.env.SLACK_BOT_TOKEN;

module.exports.web = new WebClient(token);
