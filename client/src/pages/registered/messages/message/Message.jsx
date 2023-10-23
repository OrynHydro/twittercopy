import { FiMoreHorizontal, FiTrash2 } from 'react-icons/fi'
import './message.css'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { BsReply } from 'react-icons/bs'
import { LuCopyPlus } from 'react-icons/lu'
import { RiFlag2Line } from 'react-icons/ri'
import { useOutsideClick } from './../../../../utils/useOutsideClick'

const Message = ({ message, user, nextMessage }) => {
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
			title: 'Delete for you',
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
			return `${inputMoment.format('dddd')}: ${inputMoment.format('h:mm A')}`
		} else if (inputMoment.isSame(now, 'month')) {
			return `${inputMoment.format('MMMM D')}: ${inputMoment.format('h:mm A')}`
		} else {
			return inputMoment.format('YYYY-MM-DD h:mm A')
		}
	}

	return (
		<div
			className={
				message.sender !== user._id &&
				(duration > 2 ||
					!nextMessage ||
					nextMessage?.sender !== message?.sender)
					? 'messageBlock lastMessage'
					: (message.sender === user._id && duration > 2) ||
					  !nextMessage ||
					  nextMessage?.sender !== message?.sender
					? 'messageBlock senderMessage lastMessage'
					: message.sender === user._id
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
						<div className='messageTextBlock'>
							<span className='messageText'>{message.text}</span>
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
								item.id === 4 && message.sender === user?._id ? null : (
									<div className='messageMorePopupItem' key={item.id}>
										<div className='messageMorePopupItemContainer'>
											{item.img}
											<span>{item.title}</span>
										</div>
									</div>
								)
							)}
						</div>
					</div>
					{nextMessage?.sender !== message?.sender ? (
						<div className='messageContainerBottom'>
							<span className='messageCreatedAt'>
								{/* {moment(message?.createdAt).format('LT')} */}
								{formatTime(new Date(message.createdAt))}
							</span>
						</div>
					) : !nextMessage ? (
						<div className='messageContainerBottom'>
							<span className='messageCreatedAt'>
								{/* {moment(message?.createdAt).format('LT')} */}
								{formatTime(new Date(message.createdAt))}
							</span>
						</div>
					) : (
						duration > 2 && (
							<div className='messageContainerBottom'>
								<span className='messageCreatedAt'>
									{/* {moment(message?.createdAt).format('LT')} */}
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
