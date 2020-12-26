const { createEventAdapter } = require('@slack/events-api');

const secret = process.env.SLACK_SIGNING_SECRET;
const PORT = process.env.PORT || 3000;

module.exports.startEventListener = function startEventListener(callback) {
  const events = createEventAdapter(secret);
  events.on('error', console.error);
  events.start(PORT).then(() => {
    console.log(`server listening on port ${PORT}`);
  });
  callback(events);
};

const respondedTo = new Set();

function hashEvent(event) {
  return `${event.channel}@${event.ts}`;
}

function ignorableEvent(event) {
  return (
    !event.text ||
    !event.channel ||
    !event.user ||
    event.edited ||
    event.subtype === 'bot_message' ||
    event.subtype === 'message_changed' ||
    event.channel_type === 'im'
    // respondedTo.has(hashEvent(event))
  );
}

module.exports.markResponded = function markResponded(event) {
  respondedTo.add(hashEvent(event));
};

module.exports.createListener = function createListener(
  events,
  type,
  handler,
  botId
) {
  events.on(type, (event) => {
    if (ignorableEvent(event)) {
      return;
    }

    handler(event, botId);
  });
};
