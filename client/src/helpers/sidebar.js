// segments in sidebar


// declaring variable that helps to get images from folder directly without importing

const PF = process.env.REACT_APP_PUBLIC_FOLDER

export const sidebarRegistered = [
    {
        id: 1,
        title: 'Home',
        img: PF + 'icon/common/home.svg',
        imgBold: PF + 'icon/bold/homeBold.svg',
        link: '/'
    },  
    {
        id: 2,
        title: 'Explore',
        img: PF + 'icon/common/hash.svg',
        imgBold: PF + 'icon/bold/hashBold.svg',
        link: '/explore'
    },  
    {
        id: 3,
        title: 'Notifications',
        img: PF + 'icon/common/bell.svg',
        imgBold: PF + 'icon/bold/bellBold.svg',
        link: '/notifications'
    },  
    {
        id: 4,
        title: 'Messages',
        img: PF + 'icon/common/mail.svg',
        imgBold: PF + 'icon/bold/mailBold.svg',
        link: '/messages'
    },
    {
        id: 5,
        title: 'Bookmarks',
        img: PF + 'icon/common/bookmark.svg',
        imgBold: PF + 'icon/bold/bookmarkBold.svg',
        link: '/bookmarks'
    },  
    {
        id: 6,
        title: 'Twitter Blue',
        img: PF + 'icon/common/twitterBlue.png',
        imgBold: PF + 'icon/bold/twitterBlueBold.png',
    },    
    {
        id: 8,
        title: 'Profile',
        img: PF + 'icon/common/user.svg',
        imgBold: PF + 'icon/bold/userBold.svg',
    },  
    {
        id: 9,
        title: 'More',
        img: PF + 'icon/utility/moreHorizontalCircle.svg',
    },  
]
export const sidebarUnregistered = [
    {
        id: 1,
        title: 'Explore',
        img: PF + 'icon/common/hash.svg',
        imgBold: PF + 'icon/bold/hashBold.svg',
        link: '/explore',
    },  
    {
        id: 2,
        title: 'Settings',
        img: PF + 'icon/common/settings.svg',
        imgBold: PF + 'icon/bold/settingsBold.svg',
        link: '/settings'
    },  
]


export const sidebarMore = [
    {
        id: 1,
        img: PF + 'icon/sidebarMore/topics.svg',
        title: 'Topics'
    },
    {
        id: 2,
        img: PF + 'icon/sidebarMore/lists.svg',
        title: 'Lists'
    },
    {
        id: 3,
        img: PF + 'icon/sidebarMore/twitterCircle.svg',
        title: 'Twitter Circle'
    },
    {
        id: 4,
        img: PF + 'icon/sidebarMore/verifiedOrgs.png',
        title: 'Verified Orgs'
    },
    {
        id: 5,
        title: 'Creator Studio',
        items: [
            {
                id: 1,
                title: 'Analytics',
                img: PF + 'icon/sidebarMore/analytics.svg',
            }
        ]
    },
    {
        id: 6,
        title: 'Professional Tools',
        items: [
            {
                id: 1,
                title: 'Twitter for Professionals',
                img: PF + 'icon/sidebarMore/professionals.svg',
            },
            {
                id: 2,
                title: 'Twitter Ads',
                img: PF + 'icon/sidebarMore/ads.svg',
            },
            {
                id: 3,
                title: 'Monetization',
                img: PF + 'icon/sidebarMore/monetization.svg',
            },
        ]
    },
    {
        id: 7,
        title: 'Settings and Support',
        items: [
            {
                id: 1,
                title: 'Settings and privacy',
                img: PF + 'icon/common/settings.svg',
            },
            {
                id: 2,
                title: 'Help Center',
                img: PF + 'icon/sidebarMore/help.svg',
            },
            {
                id: 3,
                title: 'Display',
                img: PF + 'icon/sidebarMore/display.svg',
            },
            {
                id: 4,
                title: 'Keyboard shortcuts',
                img: PF + 'icon/sidebarMore/shortcuts.svg',
            },
        ]
    },
]