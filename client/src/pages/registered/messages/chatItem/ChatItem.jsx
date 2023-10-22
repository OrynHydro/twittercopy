import { useEffect, useState } from 'react'

import './chatItem.css'

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
				<div className='chatItemUserData'>
					<h2 className='chatItemUsername'>{chatMember?.username}</h2>
					<span className='chatItemUserId'>{chatMember?.userId}</span>
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
		</div>
	)
}

export default ChatItem
