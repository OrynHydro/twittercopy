// presets to sidebar in settings 

export const sidebarPersonalization = [
    {
        id: 1,
        title: 'Personalization',
        items: [
            {
                id: 1,
                title: 'Personalized ads',
                text: 'You will always see ads on Twitter based on your Twitter activity. When this setting is enabled, Twitter may further personalize ads from Twitter advertisers, on and off Twitter, by combining your Twitter activity with other online activity and information from our partners.'
            },
            {
                id: 2,
                title: 'Personalize based on your inferred identity',
                text: 'Twitter will always personalize your experience based on information you’ve provided, as well as the devices you’ve used to log in. When this setting is enabled, Twitter may also personalize based on other inferences about your identity, like devices and browsers you haven’t used to log in to Twitter or email addresses and phone numbers similar to those linked to your Twitter account.'
            },
        ]
    },
    {
        id: 2,
        title: 'Data',
        items: [
            {
                id: 3,
                title: 'Allow additional information sharing with business partners',
                text: 'Twitter always shares information with business partners as a way to run and improve its products. When enabled, this allows Twitter to share additional information with those partners to help support running Twitter’s business, including making Twitter’s marketing activities on other sites and apps more relevant for you.'
            },
        ]
    },
]

export const sidebarData = [
    {
        id: 1,
        title: "Account",
        onclick: 'account'
    },
    {
        id: 2,
        title: "Apps, devices & information",
        onclick: 'devices'
    },
    {
        id: 3,
        title: "Interests and ads data",
        onclick: 'ads'
    },
    {
        id: 4,
        title: "Download archive",
        onclick: 'request_data'
    },
]

export const sidebarDataAcc = [
    {
        id: 1,
        title: "Languages",
        onclick: 'account'
    },
    {
        id: 2,
        title: "Gender",
        onclick: 'gender'
    },
    {
        id: 3,
        title: "Age",
        onclick: 'age'
    },
]

export const sidebarDataAccItems = [
    {
        id: 1,
        title: "Gender",
        postTitle: "This is the gender that Twitter has most strongly associated with you."
    },
    {
        id: 2,
        title: "Age",
        postTitle: "These are the age ranges associated with you."
    },
]

export const sidebarDataApps = [
    {
        id: 1,
        text: "These are devices Twitter uses to improve and measure your experience on this browser. ",
        addition: "Learn more",
        hasHr: false,
    },
    {
        id: 2,
        title: "Browsers",
        counter: '0',
        text: "You can remove this information by disabling “Personalize based on your inferred identity” in your",
        addition: "Inferred identity ",
        settings: 'settings',
    },
    {
        id: 3,
        title: "Mobile Devices",
        counter: '0',
        text: "You can remove this information by disabling “Personalize based on your inferred identity” in your  ",
        addition: "Inferred identity ",
        settings: 'settings',
    },
    {
        id: 4,
        title: "Email addresses",
        text: "There are inferred hashes of email addresses that share common components with the email address you have provided to Twitter. You can remove this information by disabling “Personalize based on your inferred identity” in your  ",
        addition: "Off-Twitter activity ",
        settings: 'settings',
    },
]

export const sidebarDataInterests = [
    {
        id: 1,
        title: "Account",
        onclick: 'twitter_interests',
        counter: '0 interests'
    },
    {
        id: 2,
        title: "Apps, devices & information",
        onclick: 'partner_interests',
        counter: '0 interests'
    },
    {
        id: 3,
        title: "Interests and ads data",
        onclick: 'audiences',
        counter: '0 audiences from 0 advertisers'
    },
]

export const sidebarAddition = [
    {
        id: 1,
        title: "Release notes",
        hasHr: false,
        items: [
            {
                id: 1,
                title: "Release notes"
            }
        ]
    },
    {
        id: 2,
        title: "Legal",
        items: [
            {
                id: 1,
                title: "Ads info"
            },
            {
                id: 2,
                title: "Cookie Policy"
            },
            {
                id: 3,
                title: "Privacy Policy"
            },
            {
                id: 4,
                title: "Terms of Service"
            },
        ]
    },
    {
        id: 3,
        title: "Miscellaneous",
        items: [
            {
                id: 1,
                title: "About"
            },
            {
                id: 2,
                title: "Accessibility"
            },
            {
                id: 3,
                title: "Advertising"
            },
            {
                id: 4,
                title: "Blog"
            },
            {
                id: 5,
                title: "Brand Resources"
            },
            {
                id: 6,
                title: "Careers"
            },
            {
                id: 7,
                title: "Developers"
            },
            {
                id: 8,
                title: "Directory"
            },
            {
                id: 9,
                title: "Help Center"
            },
            {
                id: 10,
                title: "Marketing"
            },
            {
                id: 11,
                title: "Status"
            },
            {
                id: 12,
                title: "Twitter for Business"
            },
        ]
    },
]
