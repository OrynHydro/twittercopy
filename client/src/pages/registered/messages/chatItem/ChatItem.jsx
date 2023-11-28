import { useEffect, useState } from 'react'

import './chatItem.css'

import moment from 'moment'
import { useOutsideClick } from '../../../../utils/useOutsideClick'
import { BsBellSlash, BsPin, BsPinFill } from 'react-icons/bs'
import { RiFlag2Line } from 'react-icons/ri'
import { FiTrash2 } from 'react-icons/fi'
import axios from 'axios'

const ChatItem = ({
	chat,
	user,
	activeChat,
	setActiveChat,
	searchedMessage,
	setDeletedChat,
	userChats,
	setUserChats,
}) => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER
	const [chatMember, setChatMember] = useState(null)

	useEffect(() => {
		if (chat && user) {
			if (chat.members.length >= 3) {
				setChatMember(chat.members.filter(item => item._id !== user?._id))
			} else {
				setChatMember(chat.members.find(item => item._id !== user?._id))
			}
		}
	}, [chat, user])

	const [activeBlock, setActiveBlock] = useState(false)

	const [activeMore, setActiveMore] = useState(false)

	const currentDate = moment()

	let duration

	if (chat.messages.length > 0) {
		duration = moment.duration(
			currentDate.diff(chat?.messages.at(-1).createdAt)
		)
	}

	const [activeMorePopup, setActiveMorePopup] = useState(false)

	const morePopup = useOutsideClick(() => setActiveMorePopup(false))

	const morePopupItems = [
		{
			id: 1,
			title: 'Pin conversation',
			img: <BsPin fontSize={18} />,
		},
		{
			id: 2,
			title: 'Snooze conversation',
			img: <BsBellSlash fontSize={18} />,
		},
		{
			id: 3,
			title: 'Report conversation',
			img: <RiFlag2Line fontSize={18} />,
		},
		{
			id: 4,
			title: 'Delete conversation',
			img: <FiTrash2 fontSize={18} color='#f4212e' />,
		},
	]

	const [pinned, setPinned] = useState(false)

	const pinChat = async () => {
		try {
			await axios
				.put(`/users/pinChat/${user._id}`, {
					chatId: chat._id,
				})
				.then(res =>
					res.data === 'Pinned'
						? setPinned(true)
						: res.data === 'Unpinned' && setPinned(false)
				)
		} catch (err) {
			console.log(err)
		}
	}

	const [deleted, setDeleted] = useState(false)

	const deleteChat = async () => {
		try {
			await axios
				.delete(`/chats/${chat._id}/delete`, {
					chatId: chat._id,
				})
				.then(() => {
					setDeleted(true)
					setActiveChat(null)
					setUserChats(userChats.filter(item => item._id !== chat._id))
				})
		} catch (err) {
			console.log(err)
		}
	}

	useEffect(() => {
		user?.pinnedChats.some(pinnedChat => pinnedChat._id === chat._id) &&
			setPinned(true)
	}, [user?.pinnedChats, chat])

	const morePopupClickHandler = item => {
		if (item.title === 'Pin conversation') {
			pinChat()
		}
		if (item.title === 'Delete conversation') {
			deleteChat()
		}
		setActiveMorePopup(false)
	}

	if (deleted) return null

	return (
		<div
			className={activeChat === chat._id ? 'chatItem active' : 'chatItem'}
			onMouseOver={() => setActiveBlock(true)}
			onMouseOut={() => setActiveBlock(false)}
			onClick={() => setActiveChat(chat._id)}
		>
			<div className='chatItemContainer'>
				{!Array.isArray(chatMember) ? (
					<img
						src={
							chatMember?.profilePicture
								? PF + 'storage/' + chatMember?.profilePicture
								: PF + 'icon/noAvatar.png'
						}
						alt=''
						className='chatItemUserAva'
					/>
				) : (
					chatMember.length === 2 && (
						<div className='chaItemAvaBlock'>
							<div className='chatItemAvaContainer'>
								<img
									src={
										chatMember[0]?.profilePicture
											? PF + 'storage/' + chatMember[0]?.profilePicture
											: PF + 'icon/noAvatar.png'
									}
									alt=''
									className='chatItemUserAva'
								/>
								<hr />
								<img
									src={
										chatMember[1]?.profilePicture
											? PF + 'storage/' + chatMember[1]?.profilePicture
											: PF + 'icon/noAvatar.png'
									}
									alt=''
									className='chatItemUserAva'
								/>
							</div>
							<div className='counterCircle'>{chatMember.length}</div>
						</div>
					)
				)}

				<div className='chatItemRight'>
					<div className='chatItemTop'>
						<div className='chatItemUserData'>
							<h2 className='chatItemUsername'>
								{Array.isArray(chatMember)
									? chatMember.map(member => member?.username).join(', ')
									: chatMember?.username}
							</h2>
							<span className='chatItemUserId'>
								{!Array.isArray(chatMember) && `${chatMember?.userId}`}
								{chat.messages.length > 0 &&
									` ·${' '} ${
										duration._data.years > 0
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
											: `${duration._data.milliseconds}ms`
									}`}
							</span>
						</div>
						{activeBlock && (
							<div
								className='chatItemMoreBlock'
								onMouseOver={() => setActiveMore(true)}
								onMouseOut={() => setActiveMore(false)}
								onClick={e => {
									setActiveMorePopup(true)
									e.stopPropagation()
								}}
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
						<div
							className={
								activeMorePopup
									? 'chatItemMorePopup active'
									: 'chatItemMorePopup'
							}
							ref={morePopup}
						>
							{morePopupItems.map(item => (
								<div
									className='chatItemMorePopupItem'
									onClick={e => {
										e.stopPropagation()
										morePopupClickHandler(item)
									}}
								>
									<div className='chatItemMorePopupItemContainer'>
										{item.title === 'Pin conversation' && pinned ? (
											<BsPinFill fontSize={20} />
										) : (
											item.img
										)}
										<span
											style={{
												color:
													item.title === 'Delete conversation' && '#f4212e',
											}}
										>
											{item.title === 'Pin conversation' && pinned
												? 'Unpin conversation'
												: item.title}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
					<div className='chatItemBottom'>
						{searchedMessage
							? searchedMessage.text
							: chat.messages.length > 0 && chat?.messages.at(-1).text}
					</div>
				</div>
			</div>
		</div>
	)
}

export default ChatItem
