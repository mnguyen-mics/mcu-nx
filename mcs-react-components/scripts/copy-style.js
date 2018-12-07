const fs = require('fs-extra');
const path = require('path');

if (fs.existsSync(path.join(__dirname, '../lib'))) {
  fs.copySync(path.join(__dirname, '../src/style'), path.join(__dirname, '../lib/style'));
  console.log('exported style');
}