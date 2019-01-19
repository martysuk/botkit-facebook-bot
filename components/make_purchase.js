
const validator = require('validator');

const quick_replies = [{
  content_type: 'text',
  title: 'Back to main menu',
  payload: 'mainMenu',
}];

const yesOrNoQuickReplies = [{
  content_type: 'text',
  title: 'Yes',
  payload: 'yes',
}, {
  content_type: 'text',
  title: 'No',
  payload: 'no',
}];

const saveOrder = (deliveryInfo) => {
  // deliveryInfo = { phoneNumber: '380639174755',
  //                 location: { lat: 49.8815884, long: 24.0381825 } }


  // let order = new Order({
  //     date: moment(message.raw_message.timestamp).format("MMM Do YYYY"),
  //     productId: '',
  //     productName: '',
  //     buyer: User.find({ facebookID: message.user })._id,
  //     buyerPhoneNumber: deliveryInfo.phoneNumber,
  //     deliverToLocation: /*{'Point', deliveryInfo.location}*/
  // })

  // order.save().then(doc => {
  //     res.send(doc)
  // }, err => res.status(400).send(err))
};


const makePurchase = (bot, message) => {
  bot.startConversation(message, async (err, convo) => {
    convo.addQuestion({
      text: 'Okay, send your phone number, please\n+XXXYYYYYYYY , where XXX - country code',
      quick_replies: [{
        content_type: 'user_phone_number',
      }],
    }, (response, convo) => {
      if (response.payload) {
        convo.gotoThread('discard_purchase');
      } else if (validator.isMobilePhone(response.text, validator.isMobilePhoneLocales, { strictMode: true })) {
        convo.setVar('phoneNumber', response.text);
        convo.gotoThread('get_location');
      } else {
        convo.gotoThread('no_phone_number');
      }
    }, {}, 'no_phone_number');


    convo.addQuestion({
      text: 'Great! Now I need delivery point.\nDo you want purchase to be delivered to your current location or somewhere nearby?',
      quick_replies: yesOrNoQuickReplies,
    }, (response, convo) => {
      if (response.text === 'Yes') {
        convo.gotoThread('share_current_location');
      } else if (response.text === 'No') {
        convo.gotoThread('share_googlemap_url');
      } else {
        convo.gotoThread('discard_purchase');
      }
    }, {}, 'get_location');


    convo.addQuestion({ text: 'Excellent! Just share it:)', quick_replies: [{ content_type: 'location' }] }, (response, convo) => {
      if (response.attachments.length !== 0) {
        convo.setVar('location', response.attachments[0].payload.coordinates);
        convo.gotoThread('order_is_made');
        saveOrder(convo.vars);
      } else {
        convo.gotoThread('discard_purchase');
      }
    }, {}, 'share_current_location');


    convo.addQuestion('Then share link of google maps` point, where we should deliver the product.', (response, convo) => {
      if (response.text.includes('www.google.com/maps')) {
        const googleMapUrl = response.text;
        const regex = new RegExp('@(.*),(.*),');
        const lonLatMatch = googleMapUrl.match(regex);
        const coordinates = {
          lat: lonLatMatch[1],
          long: lonLatMatch[2],
        };
        convo.setVar('location', coordinates);
        convo.gotoThread('order_is_made');
      } else {
        convo.gotoThread('discard_purchase');
      }
    }, {}, 'share_googlemap_url');


    convo.addQuestion({ text: 'Do you want to discard the purchase?', quick_replies: yesOrNoQuickReplies }, (response, convo) => {
      if (response.text === 'Yes') {
        convo.gotoThread('quit');
      } else if (response.text === 'No') {
        convo.gotoThread('user_last_order_step');
      } else {
        convo.gotoThread('discard_purchase');
      }
    }, {}, 'discard_purchase');


    convo.addQuestion({
      text: 'Sorry, I may have misunderstood you.',
      quick_replies: [{
        content_type: 'text',
        title: 'Let`s continue!',
        payload: 'continue',
      }],
    }, (response, convo) => {
      if (response.text === 'Let`s continue!') {
        const alreadySent = Object.keys(convo.vars);
        if (alreadySent.indexOf('phoneNumber') > -1 && alreadySent.indexOf('location') < 0) {
          convo.gotoThread('get_location');
        } else if (alreadySent.indexOf('phoneNumber') > -1 && alreadySent.indexOf('location') > -1) {
          convo.gotoThread('order_is_made');
        } else if (alreadySent.indexOf('phoneNumber') < 0 && alreadySent.indexOf('location') < 0) {
          convo.gotoThread('no_phone_number');
        }
      } else {
        convo.gotoThread('discard_purchase');
      }
    }, {}, 'user_last_order_step');


    /* price to be paid */
    convo.addMessage({ text: 'Thanks for your purchase!\nOur courier will get in touch within 2 hours :)', quick_replies }, 'order_is_made');

    convo.addMessage({ text: 'Okay, get in touch when you are ready to order:)', quick_replies }, 'quit');


    // let userPurchases = await User.findOne({ facebookID: message.userID }).purchases
    const userPurchases = [{ buyerPhoneNumber: '380639174755' }];

    if (userPurchases.length !== 0) {
      convo.ask({
        text: 'Perfect! Do you have the same phone number as last time?',
        quick_replies: yesOrNoQuickReplies,
      }, (response, convo) => {
        if (response.text === 'No') {
          convo.gotoThread('no_phone_number');
        } else if (response.text === 'Yes') {
          convo.setVar('phoneNumber', userPurchases[userPurchases.length - 1].buyerPhoneNumber);
          convo.gotoThread('get_location');
        } else {
          convo.gotoThread('discard_purchase');
        }
      });
    } else {
      convo.gotoThread('no_phone_number');
    }
  });
};


module.exports = { makePurchase };
