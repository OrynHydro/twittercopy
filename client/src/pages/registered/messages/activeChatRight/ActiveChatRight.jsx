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
			if (chat.members.length >= 3) {
				setChatMember(chat.members.filter(item => item._id !== user?._id))
			} else {
				setChatMember(chat.members.find(item => item._id !== user?._id))
			}
		}
	}, [chat, user])

	const [text, setText] = useState('')

	const socket = useRef()

	const [messages, setMessages] = useState([])
	const [arrivalMessage, setArrivalMessage] = useState(null)

	useEffect(() => {
		socket.current = io('ws://localhost:8900')
		socket.current.on('getMessage', data => {
			data.text.createdAt = moment(Date.now()).format(
				'YYYY-MM-DDTHH:mm:ss.SSSZ'
			)
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
		if (chat) setMessages(chat.messages)
	}, [chat])

	const sendMessage = async () => {
		if (!text && !file) return
		try {
			const formData = new FormData()
			const fileName =
				'm' +
				Math.random().toString(16).slice(2) +
				'.' +
				file?.name.split('.')[1]

			formData.append('name', fileName)
			formData.append('files', file)

			await axios.post(`/upload`, formData)

			const newMessage = {
				chatId: chat._id,
				sender: user._id,
				text: text,
				originalMessage: repliedMessage,
				img: file ? fileName : '',
			}

			socket.current.emit('sendMessage', {
				senderId: user._id,
				receiverId: Array.isArray(chatMember)
					? chatMember.map(member => member._id)
					: chatMember._id,
				text: newMessage,
			})

			const message = await axios.post('/messages', newMessage)
			await axios.put(`/chats/addMessage/${message.data.chatId}`, {
				messageId: message.data._id,
			})

			console.log(message)

			setMessages(prevMessages => [
				...prevMessages,
				{
					...message.data,
					sender: user,
					originalMessage: repliedMessage,
				},
			])

			setRepliedMessage(null)
			setFile(null)
			setText('')
		} catch (err) {
			console.log(err)
		}
	}

	const handleKeyDown = e => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			sendMessage()
		}
	}

	const [repliedMessage, setRepliedMessage] = useState(null)

	const [file, setFile] = useState(null)

	return (
		<div className='activeChatContainer'>
			<div className='activeChatTop'>
				<div className='activeChatTopLeft'>
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
							</div>
						)
					)}
					<h2 className='activeChatUsername'>
						{Array.isArray(chatMember)
							? chatMember.map(member => member?.username).join(', ')
							: chatMember?.username}
					</h2>
				</div>
				<div className='activeChatTopRight'>
					<AiOutlineInfoCircle fontSize={20} />
				</div>
			</div>
			<div className='activeChatMid'>
				{messages.length > 0 && (
					<div className='activeChatMidContainer'>
						{!Array.isArray(chatMember) && (
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
						)}

						<div className='activeChatMidMessagesBlock'>
							{messages.map((message, index) => (
								<Message
									message={message}
									key={index}
									user={user}
									nextMessage={messages[messages.indexOf(message) + 1]}
									chat={chat}
									sender={message.sender}
									setRepliedMessage={setRepliedMessage}
								/>
							))}
						</div>
					</div>
				)}
			</div>
			{repliedMessage && (
				<div className='activeChatRepliedMessageBlock'>
					<div className='activeChatRepliedMessageContainer'>
						<div className='repliedMessageUserData'>
							<h3>{repliedMessage.sender?.username}</h3>
							<span>{repliedMessage?.text}</span>
						</div>
						<div
							className='newMessageModalCross'
							onClick={() => setRepliedMessage(null)}
						>
							<img src={PF + 'icon/utility/x.svg'} alt='' />
						</div>
					</div>
				</div>
			)}
			<div className='activeChatBottom'>
				<div className='activeChatBottomContainer'>
					{!file && (
						<div className='activeChatBottomIcons'>
							<label className='activeChatBottomIcon' htmlFor='image'>
								<img src={PF + 'icon/common/image.svg'} alt='' />
								<input
									type='file'
									id='image'
									hidden
									onChange={e => setFile(e.target.files[0])}
								/>
							</label>
							<div className='activeChatBottomIcon'>
								<img src={PF + 'icon/common/gif.png'} alt='' />
							</div>
							<div className='activeChatBottomIcon'>
								<img src={PF + 'icon/common/smile.svg'} alt='' />
							</div>
						</div>
					)}

					{file && (
						<div className='fileContainer'>
							<div className='sendMessageImgContainer'>
								<img
									className='sendMessageImg'
									src={URL.createObjectURL(file)}
								/>
								<div
									className='imgContainerCrossBlock'
									title='Remove'
									onClick={() => setFile(null)}
								>
									<span>&#10005;</span>
								</div>
							</div>
							<TextareaAutosize
								className='activeChatBottomInput'
								type='text'
								onChange={e => setText(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder='Start a new message'
								value={text}
							/>
						</div>
					)}

					{!file && (
						<TextareaAutosize
							className='activeChatBottomInput'
							type='text'
							onChange={e => setText(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder='Start a new message'
							value={text}
						/>
					)}

					<div
						className={
							text || file ? 'sendMessageBlock' : 'sendMessageBlock disabled'
						}
						onClick={sendMessage}
					>
						<PiPaperPlaneRightBold
							fontSize={18}
							color={text || file ? '#37a6f1' : '#93ccf2'}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ActiveChatRight
