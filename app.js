const db = require('./database');
const listen = require('./listen');
const send = require('./send');
const get = require('./get');
const find = require('./find');
const utils = require('./utils');

// Get all workspace members on app start
const members = [];
get.members(1000).then((response) => {
  members.push(...response.members);
});

listen.message((event) => {
  const {text, channel, user: userFrom} = event;

  const users = find.users(text);
  const tacos = find.tacos(text);

  if (!users.length || !tacos.length) return false;

  users.forEach((userTo) => {
    if (userFrom === userTo) return;

    db.addTaco(channel, userFrom, userTo, () => {
      send.confirmation.taco(channel, userFrom, userTo);
    });
  });

  return listen.answer;
});

listen.mention((event) => {
  const {text, channel} = event;

  if (find.leaderboard(text)) db.getAllTacos((tacos) => {
      const users = utils.countTacosByUser(members, tacos);
      send.leaderboard(channel, users);
    });

  if (find.rain(text)) send.reaction.rain(channel);
  if (find.dance(text)) send.reaction.dance(channel);

  return listen.answer;
});