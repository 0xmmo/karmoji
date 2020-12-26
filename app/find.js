module.exports.textIncludes = function textIncludes(text, regexes) {
  const lower = text.toLowerCase();
  for (const regex of regexes) {
    if (lower.match(regex) !== null) {
      return true;
    }
  }
  return false;
};

module.exports.mentionedUsers = function(text) {
  const matches = text.match(/<@[A-Z0-9]{9,12}>/g);
  return matches
    ? matches.map((wrapped) => wrapped.replace('<@', '').replace('>', ''))
    : [];
};
