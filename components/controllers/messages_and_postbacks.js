const cron = require('node-cron');

const { getUserInfo, getUserPurchases, getUserFavourites, getUserPurchasesOfDay,
  feedbackTwoDaysAfter, addNewUserToDB } = require(`${__dirname}../../user_activity.js`);
  
const { shopGoods, aboutProduct } = require(`${__dirname}../../best_buy_modules/api_usage.js`);
const { linkActivated, getMyReferral } = require(`${__dirname}../../referral_program.js`);
const { makePurchase } = require(`${__dirname}../../make_purchase.js`);
const quick_replies = require(`${__dirname}../../all_quick_replies.js`).mainMenu;


// cron function that is called once a day to check all users that have bought smth 2 days ago to gather the feedback
const gatherFeedback = cron.schedule('0 20 1-31 1-12 *', () => {
  feedbackTwoDaysAfter(bot);
});


module.exports = (controller) => {

  gatherFeedback.start();


  controller.on('message_received,facebook_postback', async (bot, message) => {

    if (message.text) {

      if (message.payload) {

        switch (message.payload) {
          case 'testingBuyButton':
            makePurchase(bot, message);
            break;
          case 'startButton':
            const userInfo = await getUserInfo(message.user).catch(err => console.log(err));
            if (!userInfo) {
              userInfo.first_name = 'new user';
            }
            bot.replyWithTyping(message, { text: `Hello, ${userInfo.first_name}. Nice to meet you here!\nChoose the option: `, quick_replies });
            if (message.referral) {
              linkActivated(bot, message.user, message.referral); //if user entered the chat with bot for the first time
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
            getMyReferral(bot, message);
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
