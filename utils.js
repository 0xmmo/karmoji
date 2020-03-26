const _ = require('lodash');

module.exports.countTacosByUser = function(members, tacos) {
  const scores = {};
  tacos.forEach((taco) => {
    if (!scores[taco.userTo]) scores[taco.userTo] = 0;
    scores[taco.userTo] += 1;
  });

  const unsortedUsers = [];
  for (const userId in scores) {
    if (scores.hasOwnProperty(userId)) {
      const user = _.find(members, {id: userId});
      if (user) {
        user.score = scores[userId];
        unsortedUsers.push(user);
      }
    }
  }

  return _.sortBy(unsortedUsers, ['score']).reverse().slice(0, 150);
};
