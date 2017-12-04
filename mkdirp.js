#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

function mkDirByPathSync(targetDir, {isRelativeToScript = false} = {}) {
  const sep = path.sep;
  const initDir = path.isAbsolute(targetDir) ? sep : '';

  targetDir.split(sep).reduce((parentDir, childDir) => {
    const baseDir = isRelativeToScript ? __dirname : '.';
    const curDir = path.resolve(baseDir, parentDir, childDir);
    try {
      fs.mkdirSync(curDir);
      console.log(`Directory ${curDir} created!`);
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }

      console.log(`Directory ${curDir} already exists!`);
      return curDir;
    }

    return curDir;
  }, initDir);
}

module.exports = mkDirByPathSync;