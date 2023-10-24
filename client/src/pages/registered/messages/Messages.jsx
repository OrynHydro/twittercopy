// importing css file, components, custom and react hooks, user context and axios library

import './messages.css'

import { Layout, PostsLoader } from '../../../components/index'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../../context/UserContext'
import { useLocalStorage } from '../../../utils/useLocalStorage'
import axios from 'axios'
import NewMessage from './newMessage/NewMessage'
import ChatItem from './chatItem/ChatItem'
import ActiveChatRight from './activeChatRight/ActiveChatRight'
import { AiFillCloseCircle } from 'react-icons/ai'

const Messages = ({ isLoading, setIsLoading }) => {
	document.title = 'Messages / Twitter'

	// user data states

	const { user, setUser } = useContext(UserContext)
	const [userInStorage, setUserInStorage] = useLocalStorage('user')

	// fetches user from local storage

	useEffect(() => {
		const fetchUser = async () => {
			const findUser = await axios.get(`/users/findByToken/${userInStorage}`)
			setUser(findUser.data)
		}
		!user && fetchUser()
	}, [user, userInStorage])

	// declaring variable that helps to get images from folder directly without importing

	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	const [newMessageModal, setNewMessageModal] = useState(false)

	const [userChats, setUserChats] = useState([])

	const [userGroups, setUserGroups] = useState([])

	const [activeChat, setActiveChat] = useState(null)

	const [isLoadingChats, setIsLoadingChats] = useState(false)

	useEffect(() => {
		const fetchChats = async () => {
			try {
				setIsLoadingChats(true)
				await axios
					.get(`/chats/getChats/${user._id}`)
					.then(res =>
						res.data.members?.length > 2
							? setUserGroups(res.data)
							: setUserChats(res.data)
					)
				setIsLoadingChats(false)
			} catch (error) {
				console.log(error)
			}
		}
		userChats?.length === 0 && userGroups?.length === 0 && user && fetchChats()
	}, [userChats?.length, userGroups?.length, user])

	const [activeSearch, setActiveSearch] = useState(false)

	const [activeArrow, setActiveArrow] = useState(false)

	const [text, setText] = useState('')

	const [activeSwitchMenu, setActiveSwitchMenu] = useState('people')

	return (
		<Layout
			isLoading={isLoading}
			setIsLoading={setIsLoading}
			user={user}
			userInStorage={userInStorage}
		>
			<div className='messagesMain'>
				<div className='messagesMainContainer'>
					<div className='messagesMainTop'>
						<h2 className='messagesMainTopTitle'>Messages</h2>
						<div className='messagesMainIconsBlock'>
							<div className='messagesMainIconBlock' title='Settings'>
								<img
									src={PF + 'icon/common/settings.svg'}
									alt=''
									className='messagesMainIcon'
								/>
							</div>
							<div
								className='messagesMainIconBlock'
								title='New message'
								onClick={() => setNewMessageModal(true)}
							>
								<img
									src={PF + 'icon/common/message.svg'}
									alt=''
									className='messagesMainIcon'
								/>
							</div>
						</div>
					</div>
				</div>
				{isLoadingChats ? (
					<div className='loader'></div>
				) : userChats?.length !== 0 ? (
					<>
						<div
							className={
								activeArrow
									? 'messagesSearchBlock activeArrow'
									: 'messagesSearchBlock'
							}
						>
							{activeArrow && (
								<div
									className='messagesSearchArrow'
									onClick={() => setActiveArrow(false)}
								>
									<img src={PF + 'icon/utility/arrowLeft.svg'} alt='' />
								</div>
							)}

							<div
								className='messagesSearch'
								style={{ borderColor: activeSearch && 'var(--blue)' }}
							>
								<div className='searchIconBlock'>
									<img
										className='searchIcon'
										src={PF + 'icon/utility/search.svg'}
										alt=''
									/>
								</div>

								<input
									onFocus={() => {
										setActiveSearch(true)
										setActiveArrow(true)
									}}
									onBlur={() => setActiveSearch(false)}
									type='text'
									placeholder='Search Direct Messages'
									value={text}
									onChange={e => setText(e.target.value)}
								/>
								{text && (
									<AiFillCloseCircle
										fontSize={22}
										style={{ cursor: 'pointer' }}
										onClick={() => setText('')}
									/>
								)}
							</div>
						</div>
						{activeArrow ? (
							<>
								<div className='searchSwitchMenu'>
									<div
										className={
											activeSwitchMenu === 'people'
												? 'searchSwitchMenuItem active'
												: 'searchSwitchMenuItem'
										}
										onClick={() => setActiveSwitchMenu('people')}
									>
										People
									</div>
									<div
										className={
											activeSwitchMenu === 'groups'
												? 'searchSwitchMenuItem active'
												: 'searchSwitchMenuItem'
										}
										onClick={() => setActiveSwitchMenu('groups')}
									>
										Groups
									</div>
									<div
										className={
											activeSwitchMenu === 'messages'
												? 'searchSwitchMenuItem active'
												: 'searchSwitchMenuItem'
										}
										onClick={() => setActiveSwitchMenu('messages')}
									>
										Messages
									</div>
								</div>
								<div className='searchingNoResults'>
									Try searching for people, groups, or messages
								</div>
							</>
						) : (
							userChats.map((item, index) => (
								<ChatItem
									key={index}
									chat={item}
									user={user}
									activeChat={activeChat}
									setActiveChat={setActiveChat}
								/>
							))
						)}
					</>
				) : (
					<div className='messagesMainBottom'>
						<h1 className='messagesMainTitle'>Welcome to your inbox!</h1>
						<p className='messagesMainText'>
							Drop a line, share Tweets and more with private conversations
							between you and others on Twitter.{' '}
						</p>
						<button
							className='messagesMainButton'
							onClick={() => setNewMessageModal(true)}
						>
							Write a message
						</button>
					</div>
				)}
			</div>
			{/* page specific rightbar */}
			<div className='messagesRight'>
				{activeChat ? (
					<ActiveChatRight
						chat={userChats.find(chat => chat._id === activeChat)}
						user={user}
					/>
				) : (
					<div className='messagesRightContainer'>
						<h1 className='messagesMainTitle'>Select a message</h1>
						<p className='messagesMainText'>
							Choose from your existing conversations, start a new one, or just
							keep swimming.
						</p>
						<button
							className='messagesMainButton'
							onClick={() => setNewMessageModal(true)}
						>
							New message
						</button>
					</div>
				)}
			</div>
			<NewMessage
				activeModal={newMessageModal}
				setActiveModal={setNewMessageModal}
				user={user}
			/>
		</Layout>
	)
}

export default Messages
