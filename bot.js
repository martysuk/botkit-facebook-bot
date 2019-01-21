const Botkit = require('botkit');

const { usage_tip } = require(`${__dirname}/components/user_activity.js`);
require('dotenv').config()

// the Botkit controller, which controls all instances of the bot
const controller = Botkit.facebookbot({ 

  verify_token: process.env.verify_token,
  access_token: process.env.page_token,
  studio_command_uri: process.env.studio_command_uri,

  // for preventing against middle attacks
  app_secret: process.env.app_secret,
  require_appsecret_proof: true,
});

// Set up an Express-powered webserver to expose oauth and webhook endpoints
const webserver = require(`${__dirname}/components/express_webserver.js`)(controller);

// Tell Facebook to start sending events to this application
require(`${__dirname}/components/subscribe_events.js`)(controller);

// Set up Facebook "messenger profile" settings such as get started button, persistent menu
require(`${__dirname}/components/messenger_profile.js`)(controller);

// Send an onboarding message when a user activates the bot
require(`${__dirname}/components/onboarding.js`)(controller);

// Load in some helpers that make running Botkit on Glitch.com better
require(`${__dirname}/components/plugin_glitch.js`)(controller);

// Get all needed controllers
require(`${__dirname}/components/controllers/facebook_referral.js`)(controller);
require(`${__dirname}/components/controllers/messages_and_postbacks.js`)(controller);


if (!process.env.page_token) {
  console.log('Error: Specify a Facebook page_token in environment.');
  usage_tip();
  process.exit(1);
}

if (!process.env.verify_token) {
  console.log('Error: Specify a Facebook verify_token in environment.');
  usage_tip();
  process.exit(1);
}

if (!process.env.best_buy_key) {
  console.log('Error: Specify a BestBuy API key in environment.');
  usage_tip();
  process.exit(1);
}
