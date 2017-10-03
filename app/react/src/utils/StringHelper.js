function toPascalCase(string) {
  return string.match(/[a-z]+/gi)
    .map(word => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase())
    .join('');
}

export {
  toPascalCase
};
