var debug = require('debug')('botkit:thread_settings');



module.exports = function (controller) {

    debug('Configuring Facebook thread settings...');
    controller.api.thread_settings.greeting('Hello! I am here to help you :)');
    controller.api.thread_settings.get_started('startButton');
    controller.api.thread_settings.menu([
        {
            "locale": "default",
            "composer_input_disabled": false,
            "call_to_actions": [
                {
                    "title": "Main menu",
                    "type": "postback",
                    "payload": "mainMenu"
                },
                {
                    "title": "Send catalogue",
                    "type": "postback",
                    "payload": "sendCatalogue"
                }
            ]
        }
    ]);
}
