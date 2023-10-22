import { FiMoreHorizontal } from 'react-icons/fi'
import './message.css'
import moment from 'moment'
import { useState } from 'react'

const Message = ({ message, user }) => {
	const [hovered, setHovered] = useState(false)

	return (
		<div
			className={
				message.sender === user._id
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
					<div className='messageContainerBottom'>
						<span className='messageCreatedAt'>
							{moment(message.createdAt).format('LT')}
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Message
