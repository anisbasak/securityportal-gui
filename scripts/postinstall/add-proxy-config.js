#!/usr/bin/env node

const fs = require('fs');

const filepath = './proxy.remote.json';
const config =
`{
  "/api": {
    "target": "https://security.ehps.ncsu.edu:443",
    "secure": false,
    "changeOrigin": true
  }
}
`;

module.exports = function() {
  // If the file can't be read, write config to it
  try {
    fs.openSync(filepath, 'r');
  } catch(error) {
    fs.writeFileSync(filepath, config);
  }
}
