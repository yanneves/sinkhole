#!/usr/bin/env node

import createVault from './createVault.js';
import doPostUploadActions from './doPostUploadActions.js';
import getUserPreferences from './getUserPreferences.js';
import initiateSetup from './initiateSetup.js';
import optimist from 'optimist';
import sessionizeOptions from './sessionizeOptions.js';
import storeInGlacier from './storeInGlacier.js';
import printUsage from './printUsage.js';


const cmd = optimist.argv._[0];
const args = optimist.argv._;

const handlers = {
  init: () => initiateSetup()
    .then(createVault),
  upload: () => sessionizeOptions({
    filepath: args[1],
  })
    .then(getUserPreferences)
    .then(storeInGlacier)
    .then(doPostUploadActions),
};

if (!handlers[cmd]) {
  printUsage();
} else {
  handlers[cmd].call()
    .then(() => console.log('All done!'))
    .catch((err) => {
      console.error(err);
      console.error('Uh oh! Something went wrong.');
    });
}