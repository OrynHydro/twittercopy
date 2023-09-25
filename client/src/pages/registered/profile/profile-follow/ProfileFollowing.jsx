import axios from 'axios'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PostsLoader } from '../../../../components'
import { FollowItem } from './follow-item/FollowItem'

export const ProfileFollowing = ({ user, anotherUser }) => {
	document.title = `People following ${anotherUser?.username}`

	const [userFollowing, setUserFollowing] = useState([])

	const findUserFollowing = async () => {
		try {
			await axios
				.get(`/users/followings/${anotherUser?._id}`)
				.then(res => setUserFollowing(res.data))
		} catch (err) {
			console.log(err)
		}
	}

	anotherUser && userFollowing.length === 0 && findUserFollowing()

	return (
		<div className='profileFollow'>
			<div className='profileSwitchBlock'>
				<div className='profileSwitchItem'>
					<Link to={`/${anotherUser?.userId}/followers`}>Followers</Link>
				</div>
				<div className='profileSwitchItem active'>Following</div>
			</div>
			<div className='followingBlock'>
				{userFollowing.length !== 0 ? (
					userFollowing.map((following, id) => (
						<FollowItem
							username={following.username}
							userId={following.userId}
							userDbId={following._id}
							profilePicture={following.profilePicture}
							key={id}
							bio={following.bio}
							followers={following.followers}
							following={following.following}
							currentUser={user}
						/>
					))
				) : (
					<PostsLoader />
				)}
			</div>
		</div>
	)
}
