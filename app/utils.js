module.exports.countTacosByUser = function(members, tacos) {
  const scores = {};
  tacos.forEach((taco) => {
    if (!scores[taco.userTo]) scores[taco.userTo] = 0;
    scores[taco.userTo] += 1;
  });

  const unsortedUsers = [];
  for (const userId in scores) {
    if (scores.hasOwnProperty(userId)) {
      const user = members.find((member) => member.id === userId);
      if (user) {
        user.score = scores[userId];
        unsortedUsers.push(user);
      }
    }
  }

  return unsortedUsers.sort((a, b) => b.score - a.score).slice(0, 150);
};

module.exports.shuffle = function shuffle(items) {
  let m = items.length,
    t,
    i;
  while (m > 0) {
    i = Math.floor(Math.random() * m--);
    t = items[m];
    items[m] = items[i];
    items[i] = t;
  }
  return items;
};
