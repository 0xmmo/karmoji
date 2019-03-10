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

  tacos.forEach(() => {
    users.forEach((userTo) => {
      if (userFrom === userTo) return;

      db.add.taco(channel, userFrom, userTo, () => {
        send.confirmation.taco(channel, userFrom, userTo);
      });
    });
  });

  if (users.length >= 3) send.reaction.everyone(channel);

  return listen.answer;
});

listen.mention((event) => {
  const {text, channel} = event;

  const post = (tacos) => {
    const users = utils.countTacosByUser(members, tacos);
    send.leaderboard(channel, users);
  };

  if (find.leaderboard(text)) {
    if (find.all(text)) db.get('tacos')
        .all()
        .do(post);
    else if (find.year(text)) db.get('tacos')
        .days(365)
        .do(post);
    else if (find.week(text)) db.get('tacos')
        .days(7)
        .do(post);
    else db.get('tacos')
        .days(30)
        .do(post);
  }

  if (find.rain(text)) send.reaction.rain(channel);
  if (find.dance(text)) send.reaction.dance(channel);
  if (find.goodbot(text)) send.reaction.yey(channel);
  if (find.badbot(text)) send.reaction.sadpanda(channel);

  return listen.answer;
});