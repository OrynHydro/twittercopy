// importing css file, components, custom and react hooks, user context and axios library

import './bookmarks.css'

import { Actual, WhoToFollow } from '../../../components/index'
import { useContext, useEffect } from 'react'
import { UserContext } from '../../../context/UserContext'
import { useLocalStorage } from '../../../utils/useLocalStorage'
import axios from 'axios'
import Layout from '../../../components/layout/Layout'

const Bookmarks = ({ isLoading, setIsLoading }) => {
	// declaring states of modal windows

	document.title = 'Bookmarks / Twitter'

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

	return (
		<Layout
			isLoading={isLoading}
			setIsLoading={setIsLoading}
			user={user}
			userInStorage={userInStorage}
		>
			<div className='bookmarks'>
				<div className='bookmarksContainer'>
					<div className='bookmarksTop'>
						<h2 className='boormarksTopTitle'>Bookmarks</h2>
						<span className='bookmarksUserId'>{user?.userId}</span>
					</div>
					<div className='bookmarksBottom'>
						<h1 className='bookmarksBottomTitle'>Save Tweets for later</h1>
						<span className='bookmarksBottomText'>
							Don’t let the good ones fly away! Bookmark Tweets to easily find
							them again in the future.
						</span>
					</div>
				</div>
			</div>
			{/* rightbar with trends */}
			<div>
				<Actual registered />
				<WhoToFollow />
			</div>
		</Layout>
	)
}

export default Bookmarks
