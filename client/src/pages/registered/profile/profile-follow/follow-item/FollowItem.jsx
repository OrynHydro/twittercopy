import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import UserPopup from './../../../../../components/user/userPopup/UserPopup'

export const FollowItem = ({
	username,
	userId,
	userDbId,
	profilePicture,
	bio,
	followers,
	following,
	currentUser,
}) => {
	// declaring variable that helps to get images from folder directly without importing

	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	const [text, setText] = useState(
		!currentUser?.following.includes(userId) ? 'Following' : 'Follow'
	)
	const [openModal, setOpenModal] = useState(false)
	const [modalText, setModalText] = useState(
		!currentUser?.following.includes(userId) ? 'Following' : 'Follow'
	)

	useEffect(() => {
		if (currentUser?.following.includes(userDbId)) {
			setText('Following')
			setModalText('Following')
		} else {
			setText('Follow')
			setModalText('Follow')
		}
	}, [currentUser?.following, userDbId])

	const followUser = async e => {
		e.preventDefault()
		if (currentUser?.following.includes(userDbId)) {
			try {
				await axios.put(`/users/${userDbId}/unfollow`, {
					userId: currentUser._id,
				})
				setModalText('Follow')
				setText('Follow')
				currentUser.following.splice(currentUser.following.indexOf(userDbId), 1)
				followers.splice(followers.indexOf(userDbId), 1)
			} catch (err) {
				console.log(err)
			}
		} else if (!currentUser?.following.includes(userDbId)) {
			try {
				await axios.put(`/users/${userDbId}/follow`, {
					userId: currentUser._id,
				})
				setModalText('Following')
				setText('Following')
				currentUser.following.push(userDbId)
				followers.push(currentUser._id)
			} catch (err) {
				console.log(err)
			}
		}
	}

	return (
		<Link to={`/${userId}`} className='followingBlockItem'>
			<div
				className='followingBlockItemLeft'
				onMouseOver={() => setOpenModal(true)}
				onMouseOut={() => setOpenModal(false)}
			>
				<div className='followingBlockItemUserAvaBlock'>
					<img
						className='followingBlockItemUserAva'
						src={
							profilePicture
								? PF + 'storage/' + profilePicture
								: PF + 'icon/noAvatar.png'
						}
						alt=''
					/>
					<div className='overlay'></div>
				</div>

				<div className='followingBlockUserData'>
					<h2 className='followingBlockUsername'>{username}</h2>
					<p className='followingBlockUserId'>
						{userId + ' '}
						{currentUser.followers.includes(userDbId) &&
						currentUser.following.includes(userDbId) ? (
							<span className='followsYou'>You follow each other</span>
						) : currentUser.followers.includes(userDbId) ? (
							<span className='followsYou'>Follows you</span>
						) : (
							currentUser.following.includes(userDbId) && (
								<span className='followsYou'>You follow</span>
							)
						)}
					</p>
					<p className='followingBlockBio'>{bio}</p>
				</div>

				<UserPopup
					modalText={modalText}
					setModalText={setModalText}
					userDbId={userDbId}
					currentUser={currentUser}
					followUser={followUser}
					userId={userId}
					username={username}
					followers={followers}
					following={following}
					profilePicture={profilePicture}
					openModal={openModal}
				/>
			</div>
			{userDbId !== currentUser?._id && (
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
					<button onClick={e => followUser(e)}>{text}</button>
					{/* {!currentUser?.following.includes(userId)} */}
				</div>
			)}
		</Link>
	)
}
