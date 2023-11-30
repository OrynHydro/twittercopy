import { FiMoreHorizontal, FiTrash2 } from 'react-icons/fi'
import './message.css'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { BsReply } from 'react-icons/bs'
import { LuCopyPlus } from 'react-icons/lu'
import { RiFlag2Line } from 'react-icons/ri'
import { useOutsideClick } from './../../../../utils/useOutsideClick'
import axios from 'axios'

const Message = ({
	message,
	user,
	nextMessage,
	sender,
	chat,
	setRepliedMessage,
}) => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER
	const [hovered, setHovered] = useState(false)

	const [duration, setDuration] = useState(null)

	useEffect(() => {
		if (!nextMessage?.createdAt || !message?.createdAt) return
		const date1 = moment(nextMessage.createdAt)
		const date2 = moment(message.createdAt)

		const difference = date1.diff(date2, 'minutes')

		setDuration(difference)
	}, [nextMessage?.createdAt, message?.createdAt])

	const [activeMore, setActiveMore] = useState(false)

	const moreItemUser = [
		{
			id: 1,
			title: 'Reply',
			img: <BsReply fontSize={20} style={{ transform: 'scaleX(-1)' }} />,
		},
		{
			id: 4,
			title: 'Report message',
			img: <RiFlag2Line />,
		},
		{
			id: 2,
			title: 'Copy message',
			img: <LuCopyPlus fontSize={20} />,
		},
		{
			id: 3,
			title: 'Delete',
			img: <FiTrash2 fontSize={20} />,
		},
	]

	const morePopup = useOutsideClick(() => setActiveMore(false))

	function formatTime(inputDate) {
		const now = moment()
		const inputMoment = moment(inputDate)

		if (inputMoment.isSame(now, 'day')) {
			return `${inputMoment.format('h:mm A')}`
		} else if (inputMoment.isSame(now.clone().subtract(1, 'day'), 'day')) {
			return `Yesterday, ${inputMoment.format('h:mm A')}`
		} else if (
			inputMoment.isSameOrAfter(now.clone().subtract(7, 'days')) &&
			inputMoment.isSameOrBefore(now)
		) {
			return `${inputMoment.format('ddd')} ${inputMoment.format('h:mm A')}`
		} else if (inputMoment.isSame(now, 'month')) {
			return `${inputMoment.format('MMMM D')} ${inputMoment.format('h:mm A')}`
		} else {
			return inputMoment.format('YYYY-MM-DD h:mm A')
		}
	}

	const [deleted, setDeleted] = useState(false)

	const deleteMessage = async () => {
		await axios.delete(`/messages/${message._id}/delete`).then(async res => {
			if (res.data === 'Message deleted') {
				await axios
					.put(`/chats/${message._id}/removeMessage`, {
						chatId: chat._id,
					})
					.then(() => {
						setDeleted(true)
						console.log('test')
					})
			}
		})
	}

	const morePopupItemHandler = item => {
		if (item.title === 'Delete') {
			deleteMessage()
		}
		if (item.title === 'Reply') setRepliedMessage(message)
		if (item.title === 'Copy message')
			navigator.clipboard.writeText(`${message.text}`)
		setActiveMore(false)
	}

	if (deleted) return null

	return (
		<div
			className={
				message.sender._id !== user._id &&
				(duration > 2 ||
					!nextMessage ||
					nextMessage?.sender._id !== message?.sender._id)
					? 'messageBlock lastMessage'
					: (message.sender._id === user._id && duration > 2) ||
					  !nextMessage ||
					  nextMessage?.sender._id !== message?.sender._id
					? 'messageBlock senderMessage lastMessage'
					: message.sender._id === user._id
					? 'messageBlock senderMessage'
					: 'messageBlock'
			}
		>
			<div className='messageContainer'>
				<div className='messageContainerBlocked'>
					<div
						className='messageContainerTop'
						onMouseOver={() => setHovered(true)}
						onMouseOut={() => setHovered(false)}
					>
						<div className='messageTextContainer'>
							{message.originalMessage && (
								<div className='replyMessage'>
									<div className='replyMessageContainer'>
										<span className='replyMessageText'>
											{message.originalMessage.text}
										</span>
									</div>
								</div>
							)}
							<div className='messageContent'>
								{nextMessage?.sender._id !== message?.sender._id ? (
									<div className='messageTextBlock'>
										<span className='messageText'>{message.text}</span>
									</div>
								) : !nextMessage ? (
									<div className='messageTextBlock'>
										<span className='messageText'>{message.text}</span>
									</div>
								) : duration > 2 ? (
									<div className='messageTextBlock'>
										<span className='messageText'>{message.text}</span>
									</div>
								) : (
									<div className='messageTextBlock noImg'>
										<span className='messageText'>{message.text}</span>
									</div>
								)}
								{nextMessage?.sender._id !== message?.sender._id ? (
									<img
										src={
											message.sender._id === user._id && user?.profilePicture
												? PF + 'storage/' + user?.profilePicture
												: message.sender._id !== user._id &&
												  sender._id?.profilePicture
												? PF + 'storage/' + sender._id?.profilePicture
												: PF + 'icon/noAvatar.png'
										}
										alt=''
										className='activeChatUserAva'
									/>
								) : !nextMessage ? (
									<img
										src={
											message.sender._id === user._id && user?.profilePicture
												? PF + 'storage/' + user?.profilePicture
												: message.sender._id !== user._id &&
												  sender._id?.profilePicture
												? PF + 'storage/' + sender._id?.profilePicture
												: PF + 'icon/noAvatar.png'
										}
										alt=''
										className='activeChatUserAva'
									/>
								) : (
									duration > 2 && (
										<img
											src={
												message.sender._id === user._id && user?.profilePicture
													? PF + 'storage/' + user?.profilePicture
													: message.sender._id !== user._id &&
													  sender._id?.profilePicture
													? PF + 'storage/' + sender._id?.profilePicture
													: PF + 'icon/noAvatar.png'
											}
											alt=''
											className='activeChatUserAva'
										/>
									)
								)}
							</div>
						</div>

						<div
							className='messageMoreBlock'
							style={{ display: !hovered && 'none' }}
							title='More'
							onClick={() => setActiveMore(true)}
						>
							<FiMoreHorizontal fontSize={20} color='#6B7F8E' />
						</div>
						<div
							className={
								activeMore ? 'messageMorePopup active' : 'messageMorePopup'
							}
							ref={morePopup}
						>
							{moreItemUser.map(item =>
								item.id === 4 && message.sender._id === user?._id ? null : (
									<div
										className='messageMorePopupItem'
										key={item.id}
										onClick={() => morePopupItemHandler(item)}
									>
										<div className='messageMorePopupItemContainer'>
											{item.img}
											<span>{item.title}</span>
										</div>
									</div>
								)
							)}
						</div>
					</div>
					{nextMessage?.sender._id !== message?.sender._id ? (
						<div className='messageContainerBottom'>
							<span className='messageCreatedAt'>
								{formatTime(new Date(message.createdAt))}
							</span>
						</div>
					) : !nextMessage ? (
						<div className='messageContainerBottom'>
							<span className='messageCreatedAt'>
								{formatTime(new Date(message.createdAt))}
							</span>
						</div>
					) : (
						duration > 2 && (
							<div className='messageContainerBottom'>
								<span className='messageCreatedAt'>
									{formatTime(new Date(message.createdAt))}
								</span>
							</div>
						)
					)}
				</div>
			</div>
		</div>
	)
}

export default Message
