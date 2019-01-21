const goBackToMainMenu = [{
    content_type: 'text',
    title: 'Back to main menu',
    payload: 'mainMenu',
}];

const goToShopOrMenu = [{
    content_type: 'text',
    title: 'Yes',
    payload: 'shop',
}, {
    content_type: 'text',
    title: 'No',
    payload: 'mainMenu',
}];


const referralSystems = [{
    content_type: 'text',
    title: 'URL m.me/bot_id',
    payload: 'url',
}, {
    content_type: 'text',
    title: 'Messenger code',
    payload: 'messengerCode',
}, {
    content_type: 'text',
    title: 'Back to main menu',
    payload: 'mainMenu',
}
]

const mainMenu = [
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


module.exports = { goBackToMainMenu, goToShopOrMenu, mainMenu, referralSystems }