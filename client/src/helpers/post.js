// bottombar presets in post

// declaring variable that helps to get images from folder directly without importing

const PF = process.env.REACT_APP_PUBLIC_FOLDER

export const PostIcons = [
    {
        id: 1,
        icon: PF + 'icon/common/message.svg',
        iconColoured: PF + 'icon/colored/messageColour.svg',
        color: '#1D9BF0',
        hoverColor: '#E1EEF6',
        counter: 999,
        title: 'Reply',
        dbTitle: 'replies'
    },
    {
        id: 2,
        icon: PF + 'icon/common/retweet.svg',
        iconColoured: PF + 'icon/colored/retweetColour.svg',
        color: '#00BA7C',
        hoverColor: '#DEF1EB',
        counter: 999,
        title: 'Retweet',
        dbTitle: 'retweets'
    },
    {
        id: 3,
        icon: PF + 'icon/common/heart.svg',
        iconColoured: PF + 'icon/colored/heartColour.svg',
        color: '#F91880',
        hoverColor: '#F7E0EB',
        counter: 999,
        title: 'Like',
        dbTitle: 'likes'
    },
    {
        id: 4,
        icon: PF + 'icon/common/chart.svg',
        iconColoured: PF + 'icon/colored/chartColour.svg',
        color: '#1D9BF0',
        hoverColor: '#E1EEF6',
        counter: 999,
        title: 'View',
        dbTitle: 'views'
    },
    {
        id: 5,
        icon: PF + 'icon/common/share.svg',
        iconColoured: PF + 'icon/colored/shareColour.svg',
        color: '#1D9BF0',
        hoverColor: '#E1EEF6',
        counter: 999,
        title: 'Share',
        dbTitle: 'shares'
    },
]