const { createEventAdapter } = require('@slack/events-api');

const port = process.env.PORT || 3000;
const secret = process.env.SLACK_SIGNING_SECRET;
const events = createEventAdapter(secret);

const answered = [];
const answer = Symbol('successful listen handler return');

module.exports.answer = answer;

module.exports.message = function(handler) {
  events.on('message', (event) => {
    if (
      !event.text ||
      !event.channel ||
      !event.user ||
      event.edited ||
      event.channel_type === 'im' ||
      event.subtype === 'bot_message' ||
      event.subtype === 'message_changed' ||
      answered.filter((ts) => ts === event.ts).length
    ) {
      return;
    }

    if (handler(event) === answer) answered.push(event.ts);
  });
};

module.exports.mention = function(handler) {
  events.on('app_mention', (event) => {
    if (
      !event.text ||
      !event.channel ||
      !event.user ||
      event.edited ||
      event.subtype === 'bot_message' ||
      event.subtype === 'message_changed' ||
      answered.filter((ts) => ts === event.ts).length
    ) {
      return;
    }

    if (handler(event) === answer) answered.push(event.ts);
  });
};

events.on('error', console.error);
events.start(port).then(() => {
  console.log(`server listening on port ${port}`);
});
