module.exports.users = function(text) {
  const matches = text.match(/<@[A-Z0-9]{9}>/g);
  return matches
    ? matches.map((wrapped) => wrapped.replace('<@', '').replace('>', ''))
    : [];
};

module.exports.tacos = function(text) {
  const matches = text.match(/:taco:/g);
  return matches ? matches : [];
};

module.exports.leaderboard = function(text) {
  return Boolean(text.match(/leaderboard/g));
};

module.exports.rain = function(text) {
  return Boolean(text.match(/make it rain/g));
};

module.exports.dance = function(text) {
  return Boolean(text.match(/dance/g));
};