// importing css file, components, custom and react hooks, user context and axios library

import './bookmarks.css'

import {
	Actual,
	Posts,
	PostsLoader,
	WhoToFollow,
} from '../../../components/index'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../../context/UserContext'
import { useLocalStorage } from '../../../utils/useLocalStorage'
import axios from 'axios'
import Layout from '../../../components/layout/Layout'
import { useOutsideClick } from '../../../utils/useOutsideClick'

const Bookmarks = ({ isLoading, setIsLoading }) => {
	// declaring states of modal windows

	document.title = 'Bookmarks / Twitter'

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

	const [bookmarks, setBookmarks] = useState([])

	const [isFetching, setIsFetching] = useState(false)

	const fetchBookmarks = async () => {
		setIsFetching(true)
		try {
			const res = await axios.get(`/users/bookmarks/${user?._id}`)
			setBookmarks(res.data)
		} catch (error) {
			console.log(error)
		}
		setIsFetching(false)
	}

	useEffect(() => {
		if (user?.bookmarks.length !== 0 && bookmarks.length === 0) fetchBookmarks()
	}, [user?.bookmarks.length, bookmarks.length])

	const [activeMore, setActiveMore] = useState(false)

	const more = useOutsideClick(() => setActiveMore(false))

	console.log(bookmarks)

	const removeBookmarks = async () => {
		setActiveMore(false)
		try {
			await axios.put(`/users/bookmarks/${user?._id}/clear`)
			setBookmarks([])
		} catch (error) {
			console.log(error)
		}
	}

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
						<div className='bookmarksTopUserData'>
							<h2 className='boormarksTopTitle'>Bookmarks</h2>
							<span className='bookmarksUserId'>{user?.userId}</span>
						</div>

						{bookmarks.length > 0 && (
							<div
								className='bookmarksTopMore'
								onClick={() => setActiveMore(true)}
							>
								<img
									src={PF + 'icon/utility/moreHorizontal.svg'}
									alt='more'
									className='bookmarksTopMoreIcon'
								/>
								<div
									className={activeMore ? 'morePopup active' : 'morePopup'}
									ref={more}
									onClick={() => removeBookmarks()}
								>
									Clear all Bookmarks
								</div>
							</div>
						)}
					</div>
					{isFetching ? (
						<PostsLoader />
					) : bookmarks.length === 0 ? (
						<div className='bookmarksBottom'>
							<h1 className='bookmarksBottomTitle'>Save Tweets for later</h1>
							<span className='bookmarksBottomText'>
								Don’t let the good ones fly away! Bookmark Tweets to easily find
								them again in the future.
							</span>
						</div>
					) : (
						bookmarks.length > 0 &&
						bookmarks.map((post, index) => (
							<Posts
								key={index}
								post={post}
								more={PF + 'icon/utility/moreHorizontal.svg'}
								moreActive={PF + 'icon/utility/moreHorizontalActive.svg'}
								currentUser={user}
								isUserPosts={post.user._id === user?._id ? true : false}
							/>
						))
					)}
				</div>
			</div>
			{/* rightbar with trends */}
			<div>
				<Actual registered user={user} />
				<WhoToFollow />
			</div>
		</Layout>
	)
}

export default Bookmarks
