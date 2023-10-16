import { useEffect, useState } from 'react'
import './listPopup.css'
import axios from 'axios'

const ListPopup = ({ list, user, opened, pinnedItem }) => {
	const [followListBtn, setFollowListBtn] = useState('Follow')

	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	useEffect(() => {
		list?.followers?.some(follower => follower._id === user._id)
			? setFollowListBtn('Following')
			: setFollowListBtn('Follow')
	}, [list?.followers, user._id])

	const followList = async () => {
		try {
			await axios
				.put(`/lists/${list?._id}/follow`, {
					userDbId: user?._id,
				})
				.then(res => {
					if (res.data === 'Unfollowed') {
						setFollowListBtn('Follow')
						list.followers = list.followers.filter(item => item !== user?._id)
					} else if (res.data === 'Followed') {
						setFollowListBtn('Following')
						list.followers.push(user?._id)
					}
				})
		} catch (err) {
			console.log(err)
		}
	}

	console.log(list?.creator)

	return (
		<div
			className='listPopup'
			style={{
				opacity: opened ? '1' : '0',
				zIndex: opened ? '1000' : '-1',
				top: pinnedItem && '150px',
			}}
			onClick={e => e.preventDefault()}
		>
			<img
				className='listPopupCover'
				src={PF + 'storage/' + list?.coverPicture}
				alt=''
			/>
			<div className='listPopupContent'>
				<h2 className='listPopupTitle'>{list?.name}</h2>
				<div className='listPopupCreator'>
					<img
						src={
							list.creator[0]?.profilePicture
								? PF + 'storage/' + list.creator[0]?.profilePicture
								: list.creator[0]?.profilePicture
								? PF + 'storage/' + list.creator?.profilePicture
								: PF + 'icon/noAvatar.png'
						}
						alt=''
					/>
					<span>
						{list.creator[0]?.username
							? list.creator[0]?.username
							: list.creator?.username}
					</span>
					<p>
						{list.creator[0]?.userId
							? list.creator[0]?.userId
							: list.creator?.userId}
					</p>
				</div>
				<div className='listPopupMembersFollowers'>
					<span>
						<strong>{list?.members?.length || 0}</strong>
						{list?.members?.length === 0 || list?.members?.length > 1
							? ' Members'
							: ' Member'}
					</span>
					<span>
						<strong>{list?.followers?.length || 0}</strong>
						{list?.followers?.length === 0 || list?.followers?.length > 1
							? ' Followers'
							: ' Follower'}
					</span>
				</div>
				<button
					className={
						followListBtn === 'Unfollow'
							? 'editProfileButtons following redButton'
							: followListBtn === 'Follow'
							? 'editProfileButtons following blackButton'
							: 'editProfileButtons following'
					}
					onMouseOver={() => {
						followListBtn !== 'Follow' && setFollowListBtn('Unfollow')
					}}
					onMouseOut={() => {
						followListBtn !== 'Follow' && setFollowListBtn('Following')
					}}
					onClick={() => followList()}
				>
					{followListBtn}
				</button>
			</div>
		</div>
	)
}

export default ListPopup
