const cron = require('node-cron');


const { shopGoods, aboutProduct } = require(`${__dirname}../../best_buy_modules/api_usage.js`);
const {
  getUserInfo, getUserPurchases, linkActivated, getUserFavourites,
  referralProgram, getUserPurchasesOfDay, feedbackTwoDaysAfter, addNewUserToDB,
} = require(`${__dirname}../../user_activity.js`);

const { makePurchase } = require(`${__dirname}../../make_purchase.js`);


// cron function that is called once a day to check all users that have bought smth 2 days ago to gather the feedback
const gatherFeedback = cron.schedule('0 20 1-31 1-12 *', () => {
  feedbackTwoDaysAfter(bot);
});


module.exports = (controller) => {
  const quick_replies = [
    {
      content_type: 'text',
      title: '👛My purchases',
      payload: 'userPurchases',
    },
    {
      content_type: 'text',
      title: '🏣Shop',
      payload: 'shop',
    },
    {
      content_type: 'text',
      title: '🌟Favourites',
      payload: 'userFavourites',
    },
    {
      content_type: 'text',
      title: '🙋‍Invite a friend',
      payload: 'userReferralLink',
    },
  ];

  gatherFeedback.start();

  controller.on('message_received,facebook_postback', async (bot, message) => {
    if (message.text) {
      const userInfo = await getUserInfo(message.user).catch(err => console.log(err));
      if (!userInfo) {
        userInfo.first_name = 'new user';
      }
      console.log(message)

      if (message.payload) {
        switch (message.payload) {
          case 'testingBuyButton':
            makePurchase(bot, message);
            break;
          case 'startButton':
            bot.replyWithTyping(message, { text: `Hello, ${userInfo.first_name}. Nice to meet you here!\nChoose the option: `, quick_replies });
            if (message.referral) {
              linkActivated(bot, message, message.referral);
            }
            break;
          case 'sendCatalogue':
            bot.say({ channel: message.user, text: 'Sorry, I am not developed yet. But soon I will work:)', quick_replies });
            break;
          case 'mainMenu':
            bot.say({ channel: message.user, text: 'Choose the option:', quick_replies });
            break;
        }
      }

      if (message.quick_reply) {
        switch (message.quick_reply.payload) {
          case 'mainMenu':
            bot.say({ channel: message.user, text: 'Choose the option:', quick_replies });
            break;
          case 'userPurchases':
            bot.say({ channel: message.user, text: 'Sorry, I am not developed yet. But soon I will work:)', quick_replies });
            // getUserPurchases(bot, message.user)
            break;
          case 'userFavourites':
            bot.say({ channel: message.user, text: 'Sorry, I am not developed yet. But soon I will work:)', quick_replies });
            // getUserFavourites(bot, message.user)
            break;
          case 'shop':
            bot.say({ channel: message.user, text: 'Sorry, I am not developed yet. But soon I will work:)', quick_replies });
            // shopGoods(bot)
            break;
          case 'userReferralLink':
            referralProgram(bot, message.user);
            break;
          case 'purchaseOfDay':
            bot.say({ channel: message.user, text: 'Sorry, I am not developed yet. But soon I will work:)', quick_replies });
            // getUserPurchasesOfDay(bot, message.user, message.text)
            break;
          case 'product':
            bot.say({ channel: message.user, text: 'Sorry, I am not developed yet. But soon I will work:)', quick_replies });
            // aboutProduct(bot, message.text)
            break;
          case 'repeat':
            bot.say({ channel: message.user, text: 'Sorry, I am not developed yet. But soon I will work:)', quick_replies });
            // aboutProduct(bot, message.text)
            break;
          case 'buy':
            bot.say({ channel: message.user, text: 'Sorry, I am not developed yet. But soon I will work:)', quick_replies });
            // makePurchase(bot, message)
            break;
        }
      }
    }
  });
};
