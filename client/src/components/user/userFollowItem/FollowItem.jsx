import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import UserPopup from '../userPopup/UserPopup'

export const UserFollowItem = ({ currentUser, item }) => {
	// declaring variable that helps to get images from folder directly without importing

	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	const [text, setText] = useState(
		!currentUser?.following.includes(item?.userId) ? 'Following' : 'Follow'
	)
	const [openModal, setOpenModal] = useState(false)
	const [modalText, setModalText] = useState(
		!currentUser?.following.includes(item?.userId) ? 'Following' : 'Follow'
	)

	useEffect(() => {
		if (currentUser?.following.includes(item?._id)) {
			setText('Following')
		} else {
			setText('Follow')
		}
	}, [currentUser?.following, item?._id])

	const followUser = async (e, item) => {
		e.preventDefault()
		if (currentUser?.following.includes(item?._id)) {
			try {
				await axios.put(`/users/${item?._id}/unfollow`, {
					userId: currentUser._id,
				})
				setText('Follow')
				setModalText('Follow')
				currentUser.following.splice(
					currentUser.following.indexOf(item?._id),
					1
				)
				item?.followers.splice(item?.followers.indexOf(item?._id), 1)
			} catch (err) {
				console.log(err)
			}
		} else if (!currentUser?.following.includes(item?._id)) {
			try {
				await axios.put(`/users/${item?._id}/follow`, {
					userId: currentUser._id,
				})
				setText('Following')
				setModalText('Following')
				currentUser.following.push(item?._id)
				item?.followers.push(currentUser._id)
			} catch (err) {
				console.log(err)
			}
		}
	}

	return (
		<Link to={`/${item?.userId}`} className='followingBlockItem'>
			<div
				className='followingBlockItemLeft'
				onMouseOver={() => setOpenModal(true)}
				onMouseOut={() => setOpenModal(false)}
			>
				<div className='followingBlockItemUserAvaBlock'>
					<img
						className='followingBlockItemUserAva'
						src={
							item?.profilePicture
								? PF + 'storage/' + item?.profilePicture
								: PF + 'icon/noAvatar.png'
						}
						alt=''
					/>
					<div className='overlay'></div>
				</div>

				<div className='followingBlockUserData'>
					<h2 className='followingBlockUsername'>{item?.username}</h2>
					<p className='followingBlockUserId'>
						{item?.userId + ' '}
						{currentUser.followers.includes(item?._id) &&
						currentUser.following.includes(item?._id) ? (
							<span className='followsYou'>You follow each other</span>
						) : currentUser.followers.includes(item?._id) ? (
							<span className='followsYou'>Follows you</span>
						) : (
							currentUser.following.includes(item?._id) && (
								<span className='followsYou'>You follow</span>
							)
						)}
					</p>
					<p className='followingBlockBio'>{item?.bio}</p>
				</div>

				<UserPopup
					modalText={modalText}
					setModalText={setModalText}
					currentUser={currentUser}
					followUser={followUser}
					openModal={openModal}
					item={item}
				/>
			</div>
			{item?._id !== currentUser?._id && (
				<div
					className={
						text === 'Unfollow'
							? 'followingBlockRight unfollowBtn'
							: text === 'Follow'
							? 'followingBlockRight followUserBtn'
							: 'followingBlockRight'
					}
					onMouseOver={() => {
						text !== 'Follow' && setText('Unfollow')
					}}
					onMouseOut={() => {
						text !== 'Follow' && setText('Following')
					}}
				>
					<button onClick={e => followUser(e, item)}>{text}</button>
				</div>
			)}
		</Link>
	)
}
