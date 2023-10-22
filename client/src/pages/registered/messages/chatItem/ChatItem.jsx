import { useEffect, useState } from 'react'

import './chatItem.css'

import moment from 'moment'

const ChatItem = ({ chat, user, activeChat, setActiveChat }) => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER
	const [chatMember, setChatMember] = useState(null)

	useEffect(() => {
		if (chat && user) {
			setChatMember(chat.members.find(item => item._id !== user?._id))
		}
	}, [chat, user])

	const [activeBlock, setActiveBlock] = useState(false)

	const [activeMore, setActiveMore] = useState(false)

	const currentDate = moment()

	const duration = moment.duration(
		currentDate.diff(chat?.messages.at(-1).createdAt)
	)

	console.log(duration)

	return (
		<div
			className={activeChat ? 'chatItem active' : 'chatItem'}
			onMouseOver={() => setActiveBlock(true)}
			onMouseOut={() => setActiveBlock(false)}
			onClick={() => setActiveChat(chat._id)}
		>
			<div className='chatItemContainer'>
				<img
					src={
						chatMember?.profilePicture
							? PF + 'storage/' + chatMember?.profilePicture
							: PF + 'icon/noAvatar.png'
					}
					alt=''
					className='chatItemUserAva'
				/>
				<div className='chatItemRight'>
					<div className='chatItemTop'>
						<div className='chatItemUserData'>
							<h2 className='chatItemUsername'>{chatMember?.username}</h2>
							<span className='chatItemUserId'>
								{chatMember?.userId} ·{' '}
								{duration._data.years > 0
									? `${duration._data.years}y`
									: duration._data.months > 0
									? `${duration._data.months}m`
									: duration._data.days > 0
									? `${duration._data.days}d`
									: duration._data.hours > 0
									? `${duration._data.hours}h`
									: duration._data.minutes > 0
									? `${duration._data.minutes}m`
									: duration._data.seconds > 0
									? `${duration._data.seconds}s`
									: `${duration._data.milliseconds}ms`}
							</span>
						</div>
						{activeBlock && (
							<div
								className='chatItemMoreBlock'
								onMouseOver={() => setActiveMore(true)}
								onMouseOut={() => setActiveMore(false)}
							>
								<img
									src={
										activeMore
											? PF + 'icon/utility/moreHorizontalActive.svg'
											: PF + 'icon/utility/moreHorizontal.svg'
									}
									alt=''
								/>
							</div>
						)}
					</div>
					<div className='chatItemBottom'>{chat?.messages.at(-1).text}</div>
				</div>
			</div>
		</div>
	)
}

export default ChatItem
