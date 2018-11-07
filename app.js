const secret = process.env.SLACK_SIGNING_SECRET;
const token = process.env.SLACK_BOT_TOKEN;
const port = process.env.PORT || 3000;

const db = require('./database');
const find = require('lodash/find');
const sortBy = require('lodash/sortBy');
const reverse = require('lodash/reverse');
const pad = require('pad');
const {createEventAdapter} = require('@slack/events-api');
const {WebClient} = require('@slack/client');
const events = createEventAdapter(secret);
const web = new WebClient(token);

// Get all users on app start
let users = [];
web.users.list({limit: 1000})
.then((response) =>{
  users = response.members;
})
.catch(console.error);

let messageTimestamps = [];
events.on('message', (event) => {
  // Event has been processed already
  if (event.event_ts && messageTimestamps.filter((ts) => ts === event.ts).length) {
    return;
  } else {
    messageTimestamps.push(event.ts);
  }

  if (event.channel_type === 'im' || !event.text || !event.channel || !event.user || event.edited) return;
  if (event.subtype && (event.subtype === 'bot_message' || event.subtype === 'message_changed')) return;

  console.log('#### message received ', event);

  let userIds = event.text.match(/<@[A-Z0-9]{9}>/g);
  const tacos = event.text.match(/:taco:/g);
  if (!userIds || !userIds.length || !tacos || !tacos.length) return;
  userIds = userIds.map((wrapped) => wrapped.replace('<@', '').replace('>', ''));

  userIds.forEach((userId) => {
    console.log('>>>>> '+userId+' has received a taco');

    const userFrom = event.user;
    const userTo = userId;
    const channel = event.channel;

    if (userFrom === userTo) {
      console.log('>>>>> '+userFrom+' no tacos for yourself');
      return;
    }

    db.addTaco(userFrom, userTo, channel, (result) => {
      web.chat.postMessage({
        channel: event.channel,
        text: `<@${userTo}> received a :taco: from <@${userFrom}>`,
      })
      .then((response) => {
        console.log('taco message sent: ', response.ts);
      })
      .catch(console.error);
    });
  });
});

let mentionTimestamps = [];
events.on('app_mention', (event) => {
  // Event has been processed already
  if (event.ts && mentionTimestamps.filter((ts) => ts === event.ts).length) {
    return;
  } else {
    mentionTimestamps.push(event.ts);
  }

  if (!event.text || !event.channel || !event.user || event.edited) return;
  if (event.subtype && (event.subtype === 'bot_message' || event.subtype === 'message_changed')) return;

  console.log('#### app mentioned ', event);

  const leaderboard = event.text.match(/leaderboard/g);
  const rain = event.text.match(/make it rain/g);

  if (leaderboard){

    db.getAllTacosByUser( (result) => {
      let scores = {};
      result.forEach((taco) => {
        if (!scores[taco.userTo]) scores[taco.userTo] = 0;
        scores[taco.userTo] += 1;
      });

      let unsortedUsers = [];
      for (let userId in scores) {
        if (!scores.hasOwnProperty(userId)) continue;
        let user = find(users, {id: userId});
        user.score = scores[userId];
        unsortedUsers.push(user);
      }

      const sortedUsers = reverse(sortBy(unsortedUsers, ['score']));

      let leaderboard = 'Here\'s the all time :taco: leaderboard\n```';
      sortedUsers.forEach((user) => {
        let name = user.name;
        if(user.name === 'taco') name = 'tacorico';
        leaderboard += `\n@${pad(name, 20)} ${user.score}`;
      });
      leaderboard += '\n```';

      web.chat.postMessage({
        channel: event.channel,
        text: leaderboard,
      })
      .then((response) => {
        console.log('leaderboard message sent: ', response.ts);
      })
      .catch(console.error);
    });

  }else if(rain){

    web.chat.postMessage({
      channel: event.channel,
      attachments: [{
        fallback: 'Dancing Taco GIF',
        image_url: 'https://media.giphy.com/media/pYCdxGyLFSwgw/giphy.gif',
      }]
    })
    .then((response) => {
      console.log('taco message sent: ', response.ts);
    })
    .catch(console.error);

  }

});

events.on('error', console.error);
events.start(port).then(() => {
  console.log(`server listening on port ${port}`);
});
