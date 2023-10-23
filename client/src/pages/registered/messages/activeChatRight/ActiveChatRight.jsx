import { useEffect, useRef, useState } from 'react'

import './activeChatRight.css'
import { AiOutlineInfoCircle } from 'react-icons/ai'

import TextareaAutosize from 'react-textarea-autosize'
import { PiPaperPlaneRightBold } from 'react-icons/pi'
import axios from 'axios'
import moment from 'moment'
import { Link } from 'react-router-dom'
import Message from './../message/Message'
import { io } from 'socket.io-client'

const ActiveChatRight = ({ chat, user }) => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER
	const [chatMember, setChatMember] = useState(null)

	useEffect(() => {
		if (chat && user) {
			setChatMember(chat.members.find(item => item._id !== user?._id))
		}
	}, [chat, user])

	const [text, setText] = useState('')

	const socket = useRef()

	const [messages, setMessages] = useState([])
	const [arrivalMessage, setArrivalMessage] = useState(null)

	useEffect(() => {
		socket.current = io('ws://localhost:8900')
		socket.current.on('getMessage', data => {
			setArrivalMessage(data.text)
		})
	}, [])

	useEffect(() => {
		arrivalMessage &&
			chat?.members.find(member => member._id === arrivalMessage.sender) &&
			setMessages(prev => [...prev, arrivalMessage])
	}, [arrivalMessage, chat])

	useEffect(() => {
		if (user) {
			socket.current.emit('addUser', user._id)
		}
	}, [user])

	useEffect(() => {
		const getChatMessages = async () => {
			setMessages(chat.messages)
		}
		if (chat && messages.length === 0) getChatMessages()
	}, [chat])

	const sendMessage = async () => {
		if (!text) return
		try {
			const newMessage = {
				chatId: chat._id,
				sender: user._id,
				text: text,
			}

			socket.current.emit('sendMessage', {
				senderId: user._id,
				receiverId: chatMember._id,
				text: newMessage,
				createdAt: moment(),
			})

			const message = await axios.post('/messages', newMessage)
			await axios.put(`/chats/addMessage/${message.data.chatId}`, {
				messageId: message.data._id,
			})

			setMessages([...messages, message.data])
			setText('')
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<div className='activeChatContainer'>
			<div className='activeChatTop'>
				<div className='activeChatTopLeft'>
					<img
						src={
							chatMember?.profilePicture
								? PF + 'storage/' + chatMember?.profilePicture
								: PF + 'icon/noAvatar.png'
						}
						alt=''
						className='activeChatUserAva'
					/>
					<h2 className='activeChatUsername'>{chatMember?.username}</h2>
				</div>
				<div className='activeChatTopRight'>
					<AiOutlineInfoCircle fontSize={20} />
				</div>
			</div>
			<div className='activeChatMid'>
				{chat?.messages.length > 0 && (
					<div className='activeChatMidContainer'>
						<Link
							className='activeChatMidUserBlock'
							to={`/${chatMember?.userId}`}
						>
							<div className='activeChatMidUserContainer'>
								<img
									src={
										chatMember?.profilePicture
											? PF + 'storage/' + chatMember?.profilePicture
											: PF + 'icon/noAvatar.png'
									}
									alt=''
									className='activeChatMidUserAva'
								/>
								<div className='activeChatMidUserData'>
									<h2 className='activeChatMidUsername'>
										{chatMember?.username}
									</h2>
									<span className='activeChatMidUserId'>
										{chatMember?.userId}
									</span>
								</div>

								{chatMember?.bio && (
									<span className='activeChatMidUserBio'>
										{chatMember?.bio}
									</span>
								)}
								<span className='activeChatMidUserJoinedAndFollowers'>
									Joined{' '}
									{moment(chatMember?.createdAt).format('MMMM') +
										' ' +
										moment(chatMember?.createdAt).format('YYYY')}{' '}
									·{' '}
									{chatMember?.followers.length === 0 ||
									chatMember?.followers.length > 1
										? `${chatMember?.followers.length} Followers`
										: '1 Follower'}
								</span>
							</div>
						</Link>
						<div className='activeChatMidMessagesBlock'>
							{messages.map((message, index) => (
								<Message
									message={message}
									key={index}
									user={user}
									nextMessage={messages[messages.indexOf(message) + 1]}
								/>
							))}
						</div>
					</div>
				)}
			</div>
			<div className='activeChatBottom'>
				<div className='activeChatBottomContainer'>
					<div className='activeChatBottomIcons'>
						<div className='activeChatBottomIcon'>
							<img src={PF + 'icon/common/image.svg'} alt='' />
						</div>
						<div className='activeChatBottomIcon'>
							<img src={PF + 'icon/common/gif.png'} alt='' />
						</div>
						<div className='activeChatBottomIcon'>
							<img src={PF + 'icon/common/smile.svg'} alt='' />
						</div>
					</div>
					<TextareaAutosize
						className='activeChatBottomInput'
						type='text'
						onChange={e => setText(e.target.value)}
						placeholder='Start a new message'
						value={text}
					/>
					<div
						className={text ? 'sendMessageBlock' : 'sendMessageBlock disabled'}
						onClick={sendMessage}
					>
						<PiPaperPlaneRightBold
							fontSize={18}
							color={text ? '#37a6f1' : '#93ccf2'}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ActiveChatRight