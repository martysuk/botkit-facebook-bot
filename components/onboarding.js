const debug = require('debug')('botkit:onboarding');

module.exports = (controller) => {
  // in case add that click to messenger is created
  controller.on('facebook_optin', (bot, message) => {
    debug('Starting an onboarding experience!');

    if (controller.config.studio_token) {
      controller.studio.run(bot, 'onboarding', message.user, message.channel, message).catch((err) => {
        debug('Error: encountered an error loading onboarding script from Botkit Studio:', err);
      });
    } else {
      bot.startConversation(message, (err, convo) => {
        if (err) {
          console.log(err);
        } else {
          convo.say('Welcome to my app! I am here to help you');
        }
      });
    }
  });
};
