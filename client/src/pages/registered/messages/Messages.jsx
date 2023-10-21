// importing css file, components, custom and react hooks, user context and axios library

import './messages.css'

import { Layout } from '../../../components/index'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../../context/UserContext'
import { useLocalStorage } from '../../../utils/useLocalStorage'
import axios from 'axios'
import NewMessage from './newMessage/NewMessage'

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
							<div className='messagesMainIconBlock' title='New message'>
								<img
									src={PF + 'icon/common/message.svg'}
									alt=''
									className='messagesMainIcon'
								/>
							</div>
						</div>
					</div>
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
				</div>
			</div>
			{/* page specific rightbar */}
			<div className='messagesRight'>
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
			</div>
			<NewMessage
				activeModal={newMessageModal}
				setActiveModal={setNewMessageModal}
			/>
		</Layout>
	)
}

export default Messages
