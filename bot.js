/* Run your bot from the command line:
    page_token=<MY PAGE TOKEN> verify_token=<MY_VERIFY_TOKEN> node bot.js */

const env = require('node-env-file');
const cron = require('node-cron');
env(__dirname + '/.env');

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

const { shopGoods, aboutProduct } = require(__dirname + '/components/best_buy_modules/api_usage.js')
const { usage_tip, getUserInfo, getUserPurchases, linkActivated, getUserFavourites,
        referralProgram, getUserPurchasesOfDay, makePurchase, feedbackTwoDaysAfter, 
        thankUserAndSaveFeedback } = require(__dirname + '/components/user_activity.js')

const Botkit = require('botkit');

const controller = Botkit.facebookbot({ //the Botkit controller, which controls all instances of the bot.

    //debug: true,
    //studio_token: process.env.studio_token,
    verify_token: process.env.verify_token,
    access_token: process.env.page_token,
    studio_command_uri: process.env.studio_command_uri,
    //json_file_store: './db_bot/', //simple local storage

    //for preventing against middle attacks
    app_secret: process.env.app_secret,
    require_appsecret_proof: true
});


// Set up an Express-powered webserver to expose oauth and webhook endpoints
const webserver = require(__dirname + '/components/express_webserver.js')(controller);

// Tell Facebook to start sending events to this application
require(__dirname + '/components/subscribe_events.js')(controller);

// Set up Facebook "thread settings" such as get started button, persistent menu
require(__dirname + '/components/thread_settings.js')(controller);

// Send an onboarding message when a user activates the bot
require(__dirname + '/components/onboarding.js')(controller);

// Load in some helpers that make running Botkit on Glitch.com better
require(__dirname + '/components/plugin_glitch.js')(controller);

const normalizedPath = require("path").join(__dirname, "skills");
require("fs").readdirSync(normalizedPath).forEach(function (file) {
    require("./skills/" + file)(controller);
});


const quick_replies = [
    {
        "content_type": "text",
        "title": "My purchases",
        "payload": "userPurchases"
    },
    {
        "content_type": "text",
        "title": "Shop",
        "payload": "shop"
    },
    {
        "content_type": "text",
        "title": "Favourites",
        "payload": "userFavourites"
    },
    {
        "content_type": "text",
        "title": "Invite a friend",
        "payload": "userReferralLink"
    }
]


//cron function that is called once a day to check all users that have bought smth 2 days ago to gather the feedback
const gatherFeedback = cron.schedule('0 20 1-31 1-12 *', () => {
    feedbackTwoDaysAfter(controller, bot)
});

gatherFeedback.start()



//referral program
controller.on('facebook_referral', async (bot, message) => {
    console.log(message)
    let userInfo = await getUserInfo(message).catch(err => console.log(err))
    if (!userInfo) {
        userInfo.first_name = 'new user'
    }
    bot.reply(message, `Hello, ${userInfo.first_name}. Welcome to my app through referral! I am here to help you.`)
    linkActivated(bot, message.user, message.referral)

});

//in case add that click to messenger is created
controller.on('facebook_optin', (bot, message) => {
    bot.reply(message, 'Welcome to my app! I am here to help you.')
})


controller.on('message_received,facebook_postback', async (bot, message) => {
    if (message.text) {
        let userInfo = await getUserInfo(message).catch(err => console.log(err))
        if (!userInfo) {
            userInfo.first_name = 'new user'
        }

        if (message.payload) {
            switch (message.payload) {
                case 'startButton':
                    bot.replyWithTyping(message, { text: `Hello, ${userInfo.first_name}. Nice to meet you here!`, quick_replies })
                    if (message.referral) {
                        bot.send(message.referral.ref, 'Your link was activated')
                        linkActivated(bot, message.user, message.referral)
                    }
                case 'mainMenu':
                    bot.reply(message.user, { text: 'Choose the option:', quick_replies })
                case 'userPurchases':
                    getUserPurchases(bot, message.user)
                case 'userFavourites':
                    getUserFavourites(bot, message.user)
                case 'shop':
                    shopGoods(bot)
                case 'userReferralLink':
                    referralProgram(bot, message.user)
                case 'purchaseOfDay':
                    getUserPurchasesOfDay(bot, message.user, message.text)
                case 'product':
                    aboutProduct(bot, message.text)
                case 'repeat':
                    aboutProduct(bot, message.text)
                case 'buy':
                    makePurchase(controller, bot, message.user) //divide into 2 functions: get phone number and location
                case 'userFeedback':
                    thankUserAndSaveFeedback(controller, bot, message.user, message.text)
            }
        }
        //testing simple local storage - controller.storage.users.save({ id: message.user, text: message.text, time: new Date() }, function (err) { if (err) console.log(err) });
    }
});