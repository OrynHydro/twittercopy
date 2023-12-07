import { Link } from 'react-router-dom'
import './notificationLogin.css'
import { SlUserFollowing } from 'react-icons/sl'
import { useInView } from 'react-intersection-observer'
import axios from 'axios'

const NotificationFollow = ({ item }) => {
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
		<div
			className={
				item.perused
					? 'notificationLogin notificationFollow perused'
					: 'notificationLogin notificationFollow'
			}
			ref={ref}
		>
			<div className='notificationLoginContainer'>
				<div className='notificationFollowLogo'>
					<SlUserFollowing fontSize={32} />
				</div>
				<div className='notificationFollowText'>
					<Link to={`/${item.sender.userId}`}>
						{item.sender.username} ({item.sender.userId})
					</Link>{' '}
					follows you now
				</div>
			</div>
		</div>
	)
}

export default NotificationFollow
