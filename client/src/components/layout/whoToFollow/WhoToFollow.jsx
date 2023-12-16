// import css, footer component and object of arrays

import './whoToFollow.css'

import { Footer } from './../../index'
import axios from 'axios'
import { useEffect, useState } from 'react'
import UserPopupFollow from './userPopupFollow/UserPopupFollow'

const WhoToFollow = ({ maxWidth, user }) => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	const [recommended, setRecommended] = useState([])
	const findRecommended = async () => {
		const res = await axios.get(`/users/${user._id}/recommendations`)
		setRecommended(res.data.slice(0, 3))
	}

	useEffect(() => {
		if (user) findRecommended()
	}, [user])

	const [activePopup, setActivePopup] = useState(false)

	const [modalText, setModalText] = useState('Follow')

	const followUser = async (e, item) => {
		e.preventDefault()
		if (user?.following.includes(item?._id)) {
			try {
				await axios.put(`/users/${item?._id}/unfollow`, {
					userId: user._id,
				})
				setModalText('Follow')
				user.following.splice(user.following.indexOf(item?._id), 1)
				item?.followers.splice(item?.followers.indexOf(item?._id), 1)
			} catch (err) {
				console.log(err)
			}
		} else if (!user?.following.includes(item?._id)) {
			try {
				await axios.put(`/users/${item?._id}/follow`, {
					userId: user._id,
				})
				setModalText('Following')
				user.following.push(item?._id)
				item?.followers.push(user._id)
			} catch (err) {
				console.log(err)
			}
		}
	}

	return (
		<div
			className='whoToFollow'
			style={{ maxWidth: maxWidth ? '340px' : '350px' }}
		>
			<div className='whoToFollowBlock'>
				<h1 className='whoToFollowTitle'>Who to follow</h1>
				{/* preset for different users */}
				{recommended.map((item, index) => (
					<div className='whoToFollowItem' key={index}>
						<div
							className='whoToFollowUser'
							onMouseOver={() => setActivePopup(true)}
							onMouseOut={() => setActivePopup(false)}
						>
							<div className='whoToFollowImgBlock'>
								<img
									className='whoToFollowUserImg'
									src={
										item?.profilePicture
											? PF + 'storage/' + item.profilePicture
											: PF + 'icon/noAvatar.png'
									}
								/>
								<div className='imgBlockOverlay'></div>
							</div>
							<div className='whoToFollowUserData'>
								<span className='whoToFollowUsername'>{item?.username}</span>
								<p className='whoToFollowUserId'>{item?.userId}</p>
							</div>
							<UserPopupFollow
								user={user}
								item={item}
								activePopup={activePopup}
								modalText={modalText}
								setModalText={setModalText}
								followUser={followUser}
							/>
						</div>

						<div
							className={
								modalText === 'Unfollow'
									? 'followingBlockRight unfollowBtn'
									: modalText === 'Follow'
									? 'followingBlockRight followUserBtn'
									: 'followingBlockRight'
							}
							onMouseOver={() => {
								modalText !== 'Follow' && setModalText('Unfollow')
							}}
							onMouseOut={() => {
								modalText !== 'Follow' && setModalText('Following')
							}}
						>
							<button onClick={e => followUser(e, item)}>{modalText}</button>
						</div>
					</div>
				))}
				<div className='showMoreBlock'>Show more</div>
			</div>
			<Footer />
		</div>
	)
}

export default WhoToFollow
