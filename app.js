const secret = process.env.SLACK_SIGNING_SECRET;
const token = process.env.SLACK_BOT_TOKEN;
const port = process.env.PORT || 3000;

const db = require('./database');
const find = require('lodash/find');
const sortBy = require('lodash/sortBy');
const reverse = require('lodash/reverse');
const pad = require('pad');
const { createEventAdapter } = require('@slack/events-api');
const { WebClient } = require('@slack/client');
const events = createEventAdapter(secret);
const web = new WebClient(token);

// Get all users on app start
let users = [];
web.users.list({limit: 1000})
.then(response =>{
  users = response.members;
})
.catch(console.error);

events.on('message', event => {

  if(event.channel_type === 'im' || !event.text || !event.channel || !event.user) return;

  const userIds = event.text.match(/<@[A-Z0-9]{9}>/g).map(wrapped => wrapped.replace('<@','').replace('>',''));
  const tacos = event.text.match(/:taco:/g);
  if(!userIds || !userIds.length || !tacos || !tacos.length) return;
  
  userIds.forEach(userId => {

    const userFrom = event.user;
    const userTo = userId;
    const channel = event.channel;

    db.addTaco(userFrom, userTo, channel, result => {

      web.chat.postMessage({ 
        channel: event.channel, 
        text: `<@${userTo}> received a :taco: from <@${userFrom}>` 
      })
      .then(response => {
        // console.log('Message sent: ', response.ts);
      })
      .catch(console.error);

    });

  });

});

events.on('app_mention', (event) => {

  if(!event.text || !event.channel || !event.user) return;

  const leaderboard = event.text.match(/leaderboard/g);
  if(!leaderboard || !leaderboard.length) return;

  db.getAllTacosByUser( result => {

    let scores = {};
    result.forEach(taco => {
      if(!scores[taco.userTo]) scores[taco.userTo] = 0;
      scores[taco.userTo] += 1;
    });

    let unsortedUsers = [];
    for(let userId in scores){
      if (!scores.hasOwnProperty(userId)) continue;
      let user = find(users,{id:userId});
      user.score = scores[userId];
      unsortedUsers.push(user);
    }

    const sortedUsers = reverse(sortBy(unsortedUsers,['score']));

    let leaderboard = 'Here\'s the all time :taco: leaderboard\n```';
    sortedUsers.forEach(user => {
      leaderboard += `\n@${pad(user.name,20)} ${user.score}`
    })
    leaderboard += '\n```';

    web.chat.postMessage({ 
      channel: event.channel, 
      text: leaderboard, 
    })
    .then(response => {
      // console.log('Message sent: ', response.ts);
    })
    .catch(console.error);

  });

});

events.on('error', console.error);
events.start(port).then(() => {
  console.log(`server listening on port ${port}`);
});