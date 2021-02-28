module.exports.countTacosByUser = function(members, tacos) {
  const scores = {};
  tacos.forEach((taco) => {
    if (!scores[taco.userTo]) {
      scores[taco.userTo] = 0;
    }
    scores[taco.userTo] += 1;
  });

  const unsortedUsers = [];
  for (const userId in scores) {
    if (scores.hasOwnProperty(userId)) {
      if (userId in members) {
        unsortedUsers.push({
          name: members[userId].name,
          score: scores[userId]
        });
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

module.exports.codeBlock = function codeBlock(lines) {
  return ['```', ...lines, '```'].join('\n');
};

module.exports.padded = function padded(text) {
  return text.padEnd(20);
};

function charAsEmoji(char, color) {
  let mappedChar = char;
  if (char === '?') {
    mappedChar = 'question';
  } else if (char === '!') {
    mappedChar = 'exclamation';
  } else if (char === '#') {
    mappedChar = 'hash';
  }
  return `alphabet-${color}-${mappedChar}`;
}

// this only works for A-Z, !, ?, and #
// and won't be displayed correct if a character is used > 2 times
module.exports.emojify = function emojify(phrase) {
  const seenChars = new Set();
  return phrase.split('').map((char) => {
    const color = seenChars.has(char) ? 'yellow' : 'white';
    seenChars.add(char);
    return charAsEmoji(char, color);
  });
};
