module.exports.users = function(tExT) {
  const matches = tExT.match(/<@[A-Z0-9]{9,12}>/g);
  return matches
    ? matches.map((wrapped) => wrapped.replace('<@', '').replace('>', ''))
    : [];
};

module.exports.tacos = function(tExT) {
  const text = tExT.toLowerCase();
  const matches = text.match(/:taco:/g);
  return matches ? matches : [];
};

module.exports.negatacos = function(tExT) {
  const text = tExT.toLowerCase();
  const matches = text.match(/:negataco:/g);
  return matches ? matches : [];
};

module.exports.leaderboard = function(tExT) {
  const text = tExT.toLowerCase();
  return Boolean(text.match(/leaderboard/g));
};

module.exports.all = function(tExT) {
  const text = tExT.toLowerCase();
  return Boolean(text.match(/all/g)) || Boolean(text.match(/all time/g));
};

module.exports.year = function(tExT) {
  const text = tExT.toLowerCase();
  return Boolean(text.match(/year/g));
};

module.exports.week = function(tExT) {
  const text = tExT.toLowerCase();
  return Boolean(text.match(/week/g));
};

module.exports.rain = function(tExT) {
  const text = tExT.toLowerCase();
  return Boolean(text.match(/make it rain/g));
};

module.exports.dance = function(tExT) {
  const text = tExT.toLowerCase();
  return Boolean(text.match(/dance/g));
};

module.exports.dice = function(tExT) {
  const text = tExT.toLowerCase();
  return (
    Boolean(text.match(/roll die/g)) ||
    Boolean(text.match(/roll a die/g)) ||
    Boolean(text.match(/dice/g)) ||
    Boolean(text.match(/:game_die:/g))
  );
};

module.exports.goodbot = function(tExT) {
  const text = tExT.toLowerCase();
  return (
    Boolean(text.match(/good bot/g)) ||
    Boolean(text.match(/thanks/g)) ||
    Boolean(text.match(/thank you/g)) ||
    Boolean(text.match(/:niiice:/g))
  );
};

module.exports.badbot = function(tExT) {
  const text = tExT.toLowerCase();
  return (
    Boolean(text.match(/bad bot/g)) || Boolean(text.match(/:oldmanyellsat:/g))
  );
};
