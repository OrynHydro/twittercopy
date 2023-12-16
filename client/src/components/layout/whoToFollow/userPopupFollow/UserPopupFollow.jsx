import { Link } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'

const UserPopupFollow = ({
	item,
	activePopup,
	user,
	modalText,
	setModalText,
	followUser,
}) => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER
	useEffect(() => {
		if (user?.following.includes(item?._id)) {
			setModalText('Following')
		} else {
			setModalText('Follow')
		}
	}, [user?.following, item?._id])

	return (
		<div
			className='followingBlockModal'
			style={{
				opacity: activePopup ? '1' : '0',
				zIndex: activePopup ? '1000' : '-1',
			}}
			onClick={e => e.preventDefault()}
		>
			<div className='followingBlockModalTop'>
				<Link to={`/${item?._id}`} className='followingBlockUserAvaBlock'>
					<img
						src={
							item?.profilePicture
								? PF + 'storage/' + item?.profilePicture
								: PF + 'icon/noAvatar.png'
						}
						alt=''
					/>
					<div className='overlay'></div>
				</Link>
				{item?._id !== user?._id && (
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
				)}
			</div>
			<div className='followingBlockModalUserData'>
				<Link to={`/${item?.userId}`}>
					<h2>{item?.username}</h2>
				</Link>
				<Link to={`/${item?.userId}`}>
					<p>{item?.userId}</p>
				</Link>
			</div>
			<div className='followingBlockModalFollow'>
				<Link to={`/${item?.userId}/following`}>
					<span className='followingBlockModalFollowItem'>
						<strong>{item?.following?.length}</strong> Following
					</span>
				</Link>

				<Link to={`/${item?.userId}/followers`}>
					<span className='followingBlockModalFollowItem'>
						<strong>{item?.followers?.length}</strong> Followers
					</span>
				</Link>
			</div>
		</div>
	)
}

export default UserPopupFollow
