// declaring variable that helps to get images from folder directly without importing

import { LuSparkles } from 'react-icons/lu'
import { BsPin } from 'react-icons/bs'
import { TfiFaceSad } from 'react-icons/tfi'
import { BiUserX, BiBlock, BiListPlus } from 'react-icons/bi'
import { IoVolumeMuteOutline } from 'react-icons/io5'
import { LiaPollSolid } from 'react-icons/lia'
import { BsCodeSlash } from 'react-icons/bs'
import { RiFlag2Line } from 'react-icons/ri'

const PF = process.env.REACT_APP_PUBLIC_FOLDER

export const postMoreUserItem = [
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

export const postMoreNotUserItem = [
	{
		title: 'Not interested in this post',
		icon: <TfiFaceSad />,
	},
	{
		title: 'Follow',
		icon: <BiUserX />,
	},
	{
		title: 'Add/remove',
		icon: <BiListPlus />,
	},
	{
		title: 'Mute',
		icon: <IoVolumeMuteOutline />,
	},
	{
		title: 'Block',
		icon: <BiBlock />,
	},
	{
		title: 'View post engagements',
		icon: <LiaPollSolid />,
	},
	{
		title: 'Embed post',
		icon: <BsCodeSlash />,
	},
	{
		title: 'Report post',
		icon: <RiFlag2Line />,
	},
]
