// followers and followings pages inside of profile

import { useState } from 'react'
import { FollowItem } from './follow-item/FollowItem'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { PostsLoader } from '../../../../components'

export const ProfileFollowers = ({ user, anotherUser }) => {
	document.title = `People followed ${anotherUser?.username}`

	const [userFollowers, setUserFollowers] = useState([])

	const findUserFollowers = async () => {
		try {
			await axios
				.get(`/users/followers/${anotherUser?._id}`)
				.then(res => setUserFollowers(res.data))
		} catch (err) {
			console.log(err)
		}
	}

	anotherUser && userFollowers.length === 0 && findUserFollowers()

	return (
		<div className='profileFollow'>
			<div className='profileSwitchBlock'>
				<div className='profileSwitchItem active'>Followers</div>
				<div className='profileSwitchItem'>
					<Link to={`/${anotherUser?.userId}/following`}>Following</Link>
				</div>
			</div>
			<div className='followingBlock'>
				{userFollowers.length !== 0 ? (
					userFollowers.map((follower, id) => (
						<FollowItem
							username={follower.username}
							userId={follower.userId}
							userDbId={follower._id}
							profilePicture={follower.profilePicture}
							key={id}
							bio={follower.bio}
							followers={follower.followers}
							following={follower.following}
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
