#!/usr/bin/env node
'use strict';

var fs = require('fs');
var process = require('child_process');

module.exports  = function() {
  // Read in initial file object, or create empty object
  try {
    var fileObj = JSON.parse(fs.readFileSync('revision.json', 'utf8'));
  } catch (e) {
    var fileObj = {};
  }

  // Get the current commit SHA
  var newSHA = process.execSync('git rev-parse --short=7 HEAD').toString().trim();
  fileObj.revision = newSHA;

  // Write the SHA back into the file
  var fileString = JSON.stringify(fileObj, null, 2);
  fs.writeFileSync('revision.json', fileString, 'utf8');
}
