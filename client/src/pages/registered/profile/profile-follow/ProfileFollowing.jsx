import axios from 'axios'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PostsLoader } from '../../../../components/index'
import { UserFollowItem } from '../../../../components/user/userFollowItem/FollowItem'

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
						<UserFollowItem item={following} key={id} currentUser={user} />
					))
				) : (
					<PostsLoader />
				)}
			</div>
		</div>
	)
}
