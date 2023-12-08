import { Link } from 'react-router-dom'
import './notificationLike.css'
import { FaHeart } from 'react-icons/fa'
import { useInView } from 'react-intersection-observer'
import axios from 'axios'
import { FaRetweet } from 'react-icons/fa6'

const NotificationLike = ({ item, retweet }) => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	const { ref, inView } = useInView({
		triggerOnce: true,
	})

	const viewNotification = async () => {
		try {
			await axios.put(`/notifications/${item._id}/read`)
		} catch (err) {
			console.log(err)
		}
	}

	if (inView) viewNotification()
	return (
		<Link
			to={`/${item.post?.user.userId}/status/${item.post?._id}`}
			className='notificationLike'
			ref={ref}
		>
			<div className='notificationLikeContainer'>
				{retweet ? (
					<FaRetweet color='#00ba7c' fontSize={32} />
				) : (
					<FaHeart color='#f91880' fontSize={32} />
				)}
				<div className='notificationLikePost'>
					<Link
						to={`/${item.sender.userId}`}
						className='notificationLikeUserAva'
					>
						<img
							src={
								item.sender.profilePicture
									? PF + 'storage/' + item.sender.profilePicture
									: PF + 'icon/noAvatar.png'
							}
							alt=''
						/>
					</Link>

					<span className='notificationLikeUsername'>
						<Link to={`/${item.sender.userId}`}>{item.sender.username}</Link>{' '}
						{retweet ? 'retweeted' : 'liked'} your post
					</span>
					<span className='notificationLikeText'>{item.post.desc}</span>
				</div>
			</div>
		</Link>
	)
}

export default NotificationLike
