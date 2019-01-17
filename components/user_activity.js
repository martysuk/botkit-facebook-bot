const request = require('request')
const env = require('node-env-file')
env('../botkit-starter-facebook/.env')

const quick_replies = [{
    "content_type": "text",
    "title": "Back to main menu",
    "payload": "mainMenu"
}]

const bestBuy = require('bestbuy')(process.env.best_buy_key)
const linkToBot = 'm.me/420306645177226'

const { shopGoods, aboutProduct } = require(__dirname + '/best_buy_modules/api_usage.js')


module.exports.usage_tip = () => {
    console.log('~~~~~~~~~~');
    console.log('Botkit Studio Starter Kit');
    console.log('Execute your bot application like this:');
    console.log('page_token=<MY PAGE TOKEN> verify_token=<MY VERIFY TOKEN> studio_token=<MY BOTKIT STUDIO TOKEN> node bot.js');
    console.log('Get Facebook token here: https://developers.facebook.com/docs/messenger-platform/implementation')
    console.log('Get a Botkit Studio token here: https://studio.botkit.ai/')
    console.log('~~~~~~~~~~');
}


module.exports.getUserInfo = async (response) => new Promise(async (resolve, reject) => {
    const usersPublicProfile = await 'https://graph.facebook.com/v2.6/' + response.user + '?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token=' + process.env.page_token;
    request({
        url: usersPublicProfile,
        json: true // parse
    }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            resolve(body)
        }
        else {
            logger.error(error)
            reject(error)
        }
    })
}).catch(error => { console.log('getUserInfo func : ', error.message); })


module.exports.linkActivated = (bot, activatorID, referral) => {
    let userInfo = await getUserInfo(activatorID).catch(err => console.log(err))
    if (!userInfo) {
        userInfo.first_name = 'new user'
    }
    //bot.reply(referral.ref, `Your link was activated by ${userInfo.first_name}. Congrats!`);
    //get to database, findByID, invitesActivated++
    //if invitesActivated == 3 => get the free product
}

module.exports.referralProgram = (bot, userID) => {
    let referralLink = linkToBot + userID
    bot.reply(userID, { text: `Your refferal link is ${referralLink} \nInvite 3 friends and get on product for free`, quick_replies })
    //smth that shows current number of activated links
}

module.exports.getUserPurchases = (bot, userID) => {
    //check if user exists in db

    //no - 'you have no purchases yet. would you like to add any?
        //yes button - shopGoods(bot) or shop payload
        //no button - mainMenu payload

    //yes
        //get all from DB, send last 5 by buttons + buttons [next 5, main menu]
        //each button in with payload - date_userID
}

module.exports.getUserFavourites = (bot, userID) => {
    //get list of all available goods, send top 10 +  buttons [next 5, main menu]
}

module.exports.getUserPurchasesOfDay = (bot, userID, date) => {
    //get productID from db searching through userID and date
    //aboutProduct(productID) - returns picture and info
    //send them and back to main menu button and repeat? button
}


module.exports.makePurchase = (controller, bot, userID) => {
    //get phone (check) - libphonenumber-js OR validator-js
    //location (current (quick-reply button type), another - also check (address-validator))
    //save name, phone, location somewhere
    //send congrats
}

module.exports.thankUserAndSaveFeedback = (controller, bot, userID, feedback) => {
    //find user in DB and last purchases
    //save feedback
    //thank 
}

const feedbackTwoDaysAfter = (controller, bot) => {
    //get all users that have bought smth 2 days ago to gather the feedback
    //send them a msg 'Rate the product from 1 to 10 pls'
}
