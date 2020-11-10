const listen = require('./listen');
const send = require('./send');
const get = require('./get');
const find = require('./find');

// Get all workspace members on app start
const members = [];
get.members(1000).then((response) => {
  members.push(...response.members);
});

const uniqueUsers = (users) => Array.from(new Set(users));

listen.message((event) => {
  const { text, channel, user: userFrom, ts } = event;

  const users = find.users(text);
  const tacos = find.tacos(text);
  const negatacos = find.negatacos(text);

  if (users.length) {
    if (tacos.length) {
      const uniques = uniqueUsers(users);
      uniques.forEach((userTo) => {
        if (userFrom === userTo) return;

        send.confirmation.reaction(channel, ts);
      });

      if (uniques.length >= 3) send.response.everyone(channel);
    }

    if (negatacos.length) {
      send.negatacoConfirmation(channel, ts);
    }
    return listen.answer;
  }

  // Only consider request answered if tacos are given to users
  return false;
});

// eslint-disable-next-line max-statements
listen.mention((event) => {
  const { text, channel } = event;

  if (find.leaderboard(text)) {
    send.leaderboardOffline(channel);
  }

  if (find.rain(text)) send.response.rain(channel);
  if (find.dance(text)) send.response.dance(channel);
  if (find.goodbot(text)) send.response.yey(channel);
  if (find.badbot(text)) send.response.sadpanda(channel);
  if (find.dice(text)) send.response.dice(channel);

  return listen.answer;
});
