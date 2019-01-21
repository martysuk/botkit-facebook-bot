const debug = require('debug')('botkit:messenger_profile');

module.exports = (controller) => {
  debug('Configuring Facebook messenger_profile settings...');
  controller.api.messenger_profile.greeting('Hello! I am here to help you :)');
  controller.api.messenger_profile.get_started('startButton');
  controller.api.messenger_profile.menu([
    {
      locale: 'default',
      composer_input_disabled: false,
      call_to_actions: [
        {
          title: 'Main menu',
          type: 'postback',
          payload: 'mainMenu',
        },
        {
          title: 'Send catalogue',
          type: 'postback',
          payload: 'sendCatalogue',
        },
        {
          title: 'Suppose I press buy button',
          type: 'postback',
          payload: 'testingBuyButton',
        },
      ],
    },
  ]);
};
