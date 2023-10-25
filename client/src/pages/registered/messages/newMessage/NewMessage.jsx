import { useEffect, useState } from 'react'
import './NewMessage.css'
import axios from 'axios'
import { PostsLoader } from './../../../../components/index'
import { PiUsersThreeDuotone } from 'react-icons/pi'
import { RxCross2 } from 'react-icons/rx'
import UserItem from '../userItem/UserItem'

const NewMessage = ({ activeModal, setActiveModal, user, userChats }) => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER
	const [activeSearch, setActiveSearch] = useState(false)

	const [users, setUsers] = useState([])

	const [text, setText] = useState('')

	const [noMatches, setNoMatches] = useState(false)

	const [isLoading, setIsLoading] = useState(false)

	const [chosenUsers, setChosenUsers] = useState([])

	useEffect(() => {
		const searchForUsers = async text => {
			setIsLoading(true)
			await axios.get(`/users/findByText?text=${text}`).then(res => {
				if (res.data === 'No matches') {
					setNoMatches(true)
				} else {
					setUsers(res.data)
					setNoMatches(false)
				}
			})
			setIsLoading(false)
		}

		text ? searchForUsers(text) : setUsers([])
	}, [text])

	const createChat = async () => {
		try {
			let members = chosenUsers.map(item => item._id)
			const userChatsMembers = userChats
				.filter(item => {
					return (
						item.members.length === 2 &&
						item.members.some(member => members.includes(member._id))
					)
				})
				.map(
					item => item.members.find(member => members.includes(member._id))._id
				)
			if (activeModalPage === 'group') {
				if (members.length === 1 && userChatsMembers.includes(members[0])) {
					setActiveModal(false)
					setChosenUsers([])
					return
				} else {
					members.unshift(user?._id)
					await axios.post('/chats', {
						members: members,
					})
					document.location.reload()
				}
			} else {
				members = members.filter(
					memberId => !userChatsMembers.includes(memberId)
				)
				if (members.length === 0) {
					setActiveModal(false)
					setChosenUsers([])
					return
				} else {
					members.unshift(user?._id)
					await axios.post('/chats', {
						members: members,
					})
					document.location.reload()
				}
			}
		} catch (err) {
			console.log(err)
		}
	}

	const [activeModalPage, setActiveModalPage] = useState('chat')

	return (
		<div className={activeModal ? 'newMessageModal active' : 'newMessageModal'}>
			<div className='newMessageModalBlock'>
				<div className='newMessageModalTop'>
					<div className='newMessageModalTopLeft'>
						<div
							className='newMessageModalCross'
							title={activeModalPage === 'group' ? 'Back' : 'Close'}
							onClick={() => {
								if (activeModalPage === 'group') {
									setActiveModalPage('chat')
									setChosenUsers([])
								} else {
									setActiveModal(false)
								}
							}}
						>
							<img
								src={
									activeModalPage === 'group'
										? PF + 'icon/utility/arrowLeft.svg'
										: PF + 'icon/utility/x.svg'
								}
								alt=''
							/>
						</div>
						<h1>New message</h1>
					</div>

					<button
						className={
							chosenUsers.length === 0
								? 'newMessageModalTopRight disabled'
								: 'newMessageModalTopRight'
						}
						disabled={chosenUsers.length === 0}
						onClick={createChat}
					>
						Next
					</button>
				</div>
				<div className='newMessageModalSearchBlock'>
					<div className='newMessageModalSearch'>
						<img
							src={
								activeSearch
									? PF + 'icon/utility/searchActive.svg'
									: PF + 'icon/utility/search.svg'
							}
							alt=''
						/>
						<input
							type='text'
							onFocus={() => setActiveSearch(true)}
							onBlur={() => setActiveSearch(false)}
							placeholder='Search people'
							onChange={e => setText(e.target.value)}
							value={text}
						/>
					</div>
					{chosenUsers.length > 0 && (
						<div className='chosenUserBlock'>
							{chosenUsers.map((item, index) => (
								<div
									className='chosenUserItem'
									key={index}
									onClick={() =>
										setChosenUsers(
											chosenUsers.filter(userItem => userItem._id !== item._id)
										)
									}
								>
									<div className='chosenUserContainer'>
										<img
											src={
												item.profilePicture
													? PF + 'storage/' + item.profilePicture
													: PF + 'icon/noAvatar.png'
											}
											alt=''
											className='userAva'
										/>
										<span className='chosenUserUsername'>{item.username}</span>
										<RxCross2 color='var(--blue)' />
									</div>
								</div>
							))}
						</div>
					)}
					<hr
						className='newMessageModalHr'
						style={{ marginTop: chosenUsers.length > 0 && '6px' }}
					/>
					{isLoading ? (
						<PostsLoader />
					) : text && noMatches ? (
						<div className='listSearchContainer'>No Users matched "{text}"</div>
					) : users.length > 0 ? (
						users.map((item, index) => (
							<UserItem
								chosenUsers={chosenUsers}
								setChosenUsers={setChosenUsers}
								setText={setText}
								item={item}
								user={user}
								key={index}
							/>
						))
					) : (
						chosenUsers.length === 0 &&
						activeModalPage !== 'group' && (
							<div
								className='createGroupBlock'
								onClick={() => setActiveModalPage('group')}
							>
								<div className='createGroupContainer'>
									<div className='createGroupImgBlock'>
										<PiUsersThreeDuotone
											fontSize={34}
											color='var(--blue)'
											style={{ padding: '8px' }}
										/>
									</div>

									<span className='createGroupText'>Create a group</span>
								</div>
							</div>
						)
					)}
					{users.length === 0 &&
						userChats.map((item, index) => (
							<UserItem
								chosenUsers={chosenUsers}
								setChosenUsers={setChosenUsers}
								setText={setText}
								item={item.members.find(member => member._id !== user._id)}
								user={user}
								key={index}
							/>
						))}
				</div>
			</div>
			<div className='overlay' onClick={() => setActiveModal(false)}></div>
		</div>
	)
}

export default NewMessage
