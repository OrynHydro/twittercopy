// importing css file, components, custom and react hooks, navigation router,
// object with arrays that helps to simplify code, user context and axios library
import './notifications.css'

import {
	Actual,
	WhoToFollow,
	Layout,
	PostsLoader,
	Posts,
} from '../../../components/index'
import { useContext, useEffect, useState } from 'react'
import { notificationsMainItems } from '../../../helpers/notifications'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { NavLink, useLocation } from 'react-router-dom'
import { UserContext } from '../../../context/UserContext'
import { useLocalStorage } from '../../../utils/useLocalStorage'
import axios from 'axios'
import NotificationLogin from './notificationLogin/NotificationLogin'
import NotificationFollow from './notificationFollow/NotificationFollow'
import NotificationLike from './notificationLike/NotificationLike'

const Notifications = ({ isLoading, setIsLoading }) => {
	// declaring page location variable using react-router-dom hook

	const location = useLocation()

	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	// user data states

	const { user, setUser } = useContext(UserContext)
	const [userInStorage, setUserInStorage] = useLocalStorage('user')

	// fetches user from local storage

	useEffect(() => {
		const fetchUser = async () => {
			const findUser = await axios.get(`/users/findByToken/${userInStorage}`)
			setUser(findUser.data)
		}
		!user && fetchUser()
	}, [user, userInStorage])

	document.title = 'Notifications / Twitter'

	// main page content that switched by switch menu

	const NotificationsAll = () => {
		return (
			<div className='notificationsMain'>
				{!user ? (
					<PostsLoader />
				) : user?.notifications.length > 0 ? (
					user.notifications.map((item, index) =>
						item.type === 'login' ? (
							<NotificationLogin item={item} key={index} user={user} />
						) : item.type === 'reply' ? (
							<Posts
								post={item.post}
								more={PF + 'icon/utility/moreHorizontal.svg'}
								moreActive={PF + 'icon/utility/moreHorizontalActive.svg'}
								currentUser={user}
								notification={item._id}
							/>
						) : item.type === 'follow' ? (
							<NotificationFollow key={index} item={item} />
						) : item.type === 'like' ? (
							<NotificationLike key={index} item={item} />
						) : (
							item.type === 'retweet' && (
								<NotificationLike key={index} item={item} retweet />
							)
						)
					)
				) : (
					<div className='notificationsMainContainer'>
						<h1 className='notificationsMainTitle'>
							Nothing to see here — yet
						</h1>
						<span className='notificationsMainText'>
							{notificationsMainItems[0].text}{' '}
						</span>
						<span className='link'>Learn more</span>
					</div>
				)}
			</div>
		)
	}

	const NotificationsVerified = () => {
		return (
			<div className='notificationsMain'>
				<div className='notificationsMainContainer'>
					<h1 className='notificationsMainTitle'>Nothing to see here — yet</h1>
					<span className='notificationsMainText'>
						{notificationsMainItems[1].text}{' '}
					</span>
					<span className='link'>Learn more</span>
				</div>
			</div>
		)
	}

	const NotificationsMentions = () => {
		return (
			<div className='notificationsMain'>
				<div className='notificationsMainContainer'>
					<h1 className='notificationsMainTitle'>Nothing to see here — yet</h1>
					<span className='notificationsMainText'>
						{notificationsMainItems[2].text}{' '}
					</span>
				</div>
			</div>
		)
	}

	return (
		<Layout
			isLoading={isLoading}
			setIsLoading={setIsLoading}
			user={user}
			userInStorage={userInStorage}
		>
			<div className='notifications'>
				<div className='notificationsTopbar'>
					<h1 className='notificationsTopbarTitle'>Notifications</h1>
					<div className='notificationsTopbarBlock'>
						<NavLink to='/notifications'>
							<div
								className={
									location.pathname === '/notifications'
										? 'notificationsTopbarItem active'
										: 'notificationsTopbarItem'
								}
							>
								All
							</div>
						</NavLink>
						<NavLink to='/notifications/verified'>
							<div
								className={
									location.pathname === '/notifications/verified'
										? 'notificationsTopbarItem active'
										: 'notificationsTopbarItem'
								}
							>
								Verified
							</div>
						</NavLink>
						<NavLink to='/notifications/mentions'>
							<div
								className={
									location.pathname === '/notifications/mentions'
										? 'notificationsTopbarItem active'
										: 'notificationsTopbarItem'
								}
							>
								Mentions
							</div>
						</NavLink>
					</div>
				</div>
				{/* routes to different switch menu pages */}
				<Routes>
					<Route path='/' element={<NotificationsAll />} />
					<Route path='/verified' element={<NotificationsVerified />} />
					<Route path='/mentions' element={<NotificationsMentions />} />
				</Routes>
			</div>
			{/* rightbar with trends */}
			<div>
				<Actual registered />
				<WhoToFollow />
			</div>
		</Layout>
	)
}

export default Notifications
