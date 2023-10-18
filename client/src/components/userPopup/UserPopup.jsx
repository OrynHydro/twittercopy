import { Link } from 'react-router-dom'
import './userPopup.css'

const UserPopup = ({
	modalText,
	setModalText,
	userDbId,
	currentUser,
	followUser,
	userId,
	username,
	following,
	followers,
	profilePicture,
	openModal,
}) => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER
	return (
		<div
			className='followingBlockModal'
			style={{
				opacity: openModal ? '1' : '0',
				zIndex: openModal ? '1000' : '-1',
			}}
			onClick={e => e.preventDefault()}
		>
			<div
				className='followingBlockModalTop'
				style={{ width: userDbId === currentUser?._id && '264px' }}
			>
				<Link to={`/${userId}`} className='followingBlockUserAvaBlock'>
					<img
						src={
							profilePicture
								? PF + 'storage/' + profilePicture
								: PF + 'icon/noAvatar.png'
						}
						alt=''
					/>
					<div className='overlay'></div>
				</Link>
				{userDbId !== currentUser?._id && (
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
						<button onClick={e => followUser(e)}>{modalText}</button>
					</div>
				)}
			</div>
			<div className='followingBlockModalUserData'>
				<Link to={`/${userId}`}>
					<h2>{username}</h2>
				</Link>
				<Link to={`/${userId}`}>
					<p>{userId}</p>
				</Link>
			</div>
			<div className='followingBlockModalFollow'>
				<Link to={`/${userId}/following`}>
					<span className='followingBlockModalFollowItem'>
						<strong>{following?.length}</strong> Following
					</span>
				</Link>

				<Link to={`/${userId}/followers`}>
					<span className='followingBlockModalFollowItem'>
						<strong>{followers?.length}</strong> Followers
					</span>
				</Link>
			</div>
		</div>
	)
}

export default UserPopup
