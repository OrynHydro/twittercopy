// declaring variable that helps to get images from folder directly without importing

import { LuSparkles } from 'react-icons/lu'
import { BsPin } from 'react-icons/bs'

const PF = process.env.REACT_APP_PUBLIC_FOLDER

export const postMoreItems = [
	{
		title: 'Delete',
		icon: PF + 'icon/common/trashRed.svg',
	},
	{
		title: 'Pin to your profile',
		icon: <BsPin />,
	},
	{
		title: 'Highlight on your profile',
		icon: <LuSparkles />,
	},
	{
		title: 'Add/remove',
		icon: PF + 'icon/sidebarMore/lists.svg',
	},
	{
		title: 'Change who can reply',
		icon: PF + 'icon/common/message.svg',
	},
	{
		title: 'View post analytics',
		icon: PF + 'icon/sidebarMore/analytics.svg',
	},
]
