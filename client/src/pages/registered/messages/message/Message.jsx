import { FiMoreHorizontal } from 'react-icons/fi'
import './message.css'
import moment from 'moment'
import { useEffect, useState } from 'react'

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
						>
							<FiMoreHorizontal fontSize={20} color='#6B7F8E' />
						</div>
					</div>
					{nextMessage?.sender !== message?.sender ? (
						<div className='messageContainerBottom'>
							<span className='messageCreatedAt'>
								{moment(message?.createdAt).format('LT')}
							</span>
						</div>
					) : !nextMessage ? (
						<div className='messageContainerBottom'>
							<span className='messageCreatedAt'>
								{moment(message?.createdAt).format('LT')}
							</span>
						</div>
					) : (
						duration > 2 && (
							<div className='messageContainerBottom'>
								<span className='messageCreatedAt'>
									{moment(message?.createdAt).format('LT')}
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
