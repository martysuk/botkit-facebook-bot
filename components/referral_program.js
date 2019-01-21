const request = require('request');
const { getUserInfo } = require(`${__dirname}/user_activity.js`);
const { goBackToMainMenu, referralSystems, mainMenu } = require(`${__dirname}/all_quick_replies.js`);

const linkToBot = 'm.me/420306645177226';

const linkActivated = async (bot, activatorID, referral) => {
    const referralID = referral.ref;
    if (activatorID != referralID) {

        const userInfo = await getUserInfo(activatorID).catch(err => console.log(err));
        const name = userInfo ? `${userInfo.first_name} ${userInfo.last_name}` : 'new user';

        bot.say({ channel: referralID, text: `Your link was activated by ${name}. Congrats!` });

        // get to database, findByID, invitesActivated++
        //const updatedUser = User.findOnepdate({ facebookID: referralID }, { $inc: { invitesActivated: 1 } }, { new: true });
        // if (updatedUser.invitesActivated >= 3) {
        //     bot.say({ channel: referralID, text: 'Your link was activated 3 times!\n You can get your free product now. Will get in touch with you later', quick_replies });
        // }
    }
};

const getMessengerURL = async (userID) => new Promise(async (resolve, reject) => {
    // throw Error('test')
    const pageProfile = await `https://graph.facebook.com/v2.6/me/messenger_codes?access_token=${process.env.page_token}`;

    request.post({
        url: pageProfile,
        form: {
            "type": "standard",
            "data": {
                "ref": userID
            },
            "image_size": 1000
        }
    }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            resolve(JSON.parse(body).uri);
        } else {
            console.log(error);
            reject(error);
        }
    })
}).catch((error) => { console.log(error.message); }); // не ловить помилки



const getMyReferral = (bot, message) => {
    bot.startConversation(message, async (err, convo) => {

        const referralLink = `${linkToBot}?ref=${message.user}`;

        convo.addMessage({
            text: `Your referral link is ${referralLink} \nInvite 3 friends and get one product for free!`,
            quick_replies: goBackToMainMenu,
        }, 'url');


        convo.addMessage({
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: "Great, here is the url, where you can get the picture",
                    buttons: [
                        {
                            type: "web_url",
                            url: await getMessengerURL(message.user),
                            title: "Messenger code",
                            webview_height_ratio: "full"
                        }
                    ]
                }
            }
        }, 'messenger_code');

        convo.addMessage({text: 'Choose the option:', quick_replies: mainMenu}, 'backToMainMenu')


        convo.ask({
            text: 'What referral system do you prefer?',
            quick_replies: referralSystems,
        }, async (response, convo) => {
            if (response.text === 'URL m.me/bot_id') {
                convo.gotoThread('url');
            } else if (response.text === 'Messenger code') {
                convo.gotoThread('messenger_code')
            }
            else {
                convo.gotoThread('backToMainMenu')
            }
        });
    })
};

module.exports = { getMyReferral, linkActivated };
