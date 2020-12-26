const { startEventListener, createListener } = require('./events');
const { handleMessage, handleMention } = require('./handlers');
const { connectDatabase } = require('./database');
const { getBotUserId } = require('./get');

Promise.all([getBotUserId(), connectDatabase()]).then(([id]) => {
  startEventListener((events) => {
    createListener(events, 'message', handleMessage, id);
    createListener(events, 'app_mention', handleMention, id);
  });
});
