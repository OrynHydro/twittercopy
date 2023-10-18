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

	useEffect(() => {
		if (list?.creator.length === 1) list.creator = list.creator[0]
	}, [list?.creator.length])

	return (
		<div
			className={
				opened && pinnedItem
					? 'listPopup active pinnedItem'
					: opened && !pinnedItem
					? 'listPopup active'
					: 'listPopup'
			}
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
							list.creator?.profilePicture
								? PF + 'storage/' + list.creator?.profilePicture
								: PF + 'icon/noAvatar.png'
						}
						alt=''
					/>
					<span>{list.creator?.username}</span>
					<p>{list.creator?.userId}</p>
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
					style={{
						display: list?.creator && list?.creator._id === user?._id && 'none',
					}}
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
