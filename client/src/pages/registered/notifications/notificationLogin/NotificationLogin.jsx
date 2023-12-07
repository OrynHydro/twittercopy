import { useEffect, useState } from 'react'
import './notificationLogin.css'
import moment from 'moment'
import { Link } from 'react-router-dom'
import axios from 'axios'

const NotificationLogin = ({ item, user }) => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER
	const [activeModal, setActiveModal] = useState(false)

	const currentTime = moment()
	const inputDateTime = moment(item.createdAt)

	const duration = moment.duration(currentTime.diff(inputDateTime))

	const [isPerused, setIsPerused] = useState(item.perused)

	const handleButtonClick = async () => {
		setActiveModal(false)
		try {
			await axios.put(`/notifications/${item._id}/read`)
			setIsPerused(true)
		} catch (err) {
			console.log(err)
		}
	}

	useEffect(() => {
		activeModal
			? (document.body.style.overflowY = 'hidden')
			: (document.body.style.overflowY = 'scroll')
	}, [activeModal])

	return (
		<>
			<div
				className={
					isPerused ? 'notificationLogin perused' : 'notificationLogin'
				}
				onClick={() => setActiveModal(true)}
			>
				<div className='notificationLoginContainer'>
					<div className='notificationLoginLogo'>
						<img src={PF + 'logo/logo.png'} alt='' />
					</div>
					<div className='notificationLoginText'>
						There was a login to your account {user?.userId} from a new device
						on {moment(item.createdAt).format('MMM DD, YYYY')}. Review it now.
					</div>
				</div>
			</div>
			<div
				className={
					activeModal
						? 'notificationLoginModal active'
						: 'notificationLoginModal'
				}
			>
				<div className='notificationLoginModalBlock'>
					<img
						className='notificationLoginModalLogo'
						src={PF + 'logo/logo.png'}
					/>
					<div className='notificationLoginModalTextBlock'>
						<h1 className='notificationLoginModalTitle'>New login alert</h1>
						<span className='notificationLoginModalText'>
							There was a login to your account {user?.userId} from a new
							device.
						</span>
						<span className='notificationLoginModalText'>
							New login <br />
							Location*: {item.location} <br />
							When:{' '}
							{moment(item.createdAt).format(
								'dddd, MMMM DD, YYYY [at] h:mm A'
							) +
								' (' +
								duration.humanize() +
								' ago)'}
						</span>
						<span className='notificationLoginModalText'>
							*Location is approximate based on the login's IP address.
						</span>
						<span className='notificationLoginModalText'>
							If this was you <br />• You can ignore this message. There's no
							need to take any action.
						</span>
						<span className='notificationLoginModalText'>
							If this wasn't you <br /> • <Link>Change your password</Link> now
							to protect your account. You'll be logged out of all your active
							Twitter sessions except the one you're using at this time.
						</span>
						<button
							className='notificationLoginModalButton'
							onClick={() => handleButtonClick()}
						>
							Got it
						</button>
					</div>
				</div>
				<div className='overlay' onClick={() => setActiveModal(false)} />
			</div>
		</>
	)
}

export default NotificationLogin
