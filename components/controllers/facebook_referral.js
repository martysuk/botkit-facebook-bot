

// referral program

const { getUserInfo, linkActivated } = require(`${__dirname}../../user_activity.js`);

module.exports = (controller) => {
  controller.on('facebook_referral', async (bot, message) => {
    const userInfo = await getUserInfo(message).catch(err => console.log(err));
    if (!userInfo) {
      userInfo.first_name = 'new user';
    }
    bot.reply(message, `Hello, ${userInfo.first_name}. Welcome to my app through referral! I am here to help you.`);
    linkActivated(bot, message.user, message.referral);
  });
};
