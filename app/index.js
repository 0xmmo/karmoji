const get = require('./get');
const { startEventListener, createListener } = require('./events');
const { handleMessage, handleMention } = require('./handlers');
const { connectDatabase } = require('./database');

// Get all workspace members on app start
const members = [];
get.members(1000).then((response) => {
  members.push(...response.members);
});

connectDatabase();
startEventListener((events) => {
  createListener(events, 'message', handleMessage);
  createListener(events, 'app_mention', handleMention);
});
