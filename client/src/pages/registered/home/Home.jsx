// importing css file, components, custom and react hooks, user context and axios library

import './home.css'

import {
	Actual,
	WhoToFollow,
	Share,
	PostsLoader,
	Layout,
} from '../../../components/index'
import { useState, useEffect, useContext } from 'react'

import { Posts } from './../../../components/index'
import { UserContext } from '../../../context/UserContext'
import { useLocalStorage } from '../../../utils/useLocalStorage'
import axios from 'axios'
import { FaRegFaceSadTear } from 'react-icons/fa6'

const Home = ({ isLoading, setIsLoading }) => {
	// declaring variable that helps to get images from folder directly without importing

	const PF = process.env.REACT_APP_PUBLIC_FOLDER
	// declaring states of custom input field

	const [activeEdit, setActiveEdit] = useState(false)
	const [activeEditCircle, setActiveEditCircle] = useState(true)
	const [activeEditRec, setActiveEditRec] = useState(false)
	const [activeEditInput, setActiveEditInput] = useState(false)
	const [hasValue, setHasValue] = useState(false)

	document.title = 'Home / Twitter'

	// removes scrollbar when modal windows are open
	activeEdit
		? (document.body.style.overflowY = 'hidden')
		: (document.body.style.overflowY = 'inherit')

	// user data states

	const { user, setUser } = useContext(UserContext)
	const [userInStorage, setUserInStorage] = useLocalStorage('user')

	// state of timeline and its loading

	const [userPosts, setUserPosts] = useState([])
	const [loadingPosts, setLoadingPosts] = useState(true)

	const [followingPosts, setFollowingPosts] = useState([])

	// fetches user from local storage

	useEffect(() => {
		const fetchUser = async () => {
			const findUser = await axios.get(`/users/findByToken/${userInStorage}`)
			setUser(findUser.data)
		}
		!user && fetchUser()
	}, [user, userInStorage])

	// fetches timeline from database

	const getTimeline = async () => {
		try {
			if (!user) return
			setLoadingPosts(true)
			const timeline = await axios.get(`/posts/timeline/${user?._id}`)
			setUserPosts(timeline.data)
			setLoadingPosts(false)
		} catch (err) {
			console.log(err)
		}
	}

	const getFollowingPosts = async () => {
		try {
			if (!user) return
			setLoadingPosts(true)
			const followingPosts = await axios.get(`/posts/followings/${user?._id}`)
			setFollowingPosts(followingPosts.data)
			setLoadingPosts(false)
		} catch (err) {
			console.log(err)
		}
	}

	const [activeSwitch, setActiveSwitch] = useState('foryou')

	useEffect(() => {
		if (user && activeSwitch === 'foryou') {
			getTimeline()
		} else if (user && activeSwitch === 'following') {
			getFollowingPosts()
		}
	}, [user, activeSwitch])

	const [activeFollowBtn, setActiveFollowBtn] = useState('Following')

	const [unfollow, setUnfollow] = useState(false)

	return (
		<Layout
			isLoading={isLoading}
			setIsLoading={setIsLoading}
			user={user}
			userInStorage={userInStorage}
		>
			<div className='home'>
				<div className='homeTopbar'>
					<h1 className='homeTopbarTitle'>Home</h1>
					<div className='homeTopbarBlock'>
						<div
							className={
								activeSwitch === 'foryou'
									? 'homeTopbarItem active'
									: 'homeTopbarItem'
							}
							onClick={() => setActiveSwitch('foryou')}
						>
							For you
						</div>
						<div
							className={
								activeSwitch === 'following'
									? 'homeTopbarItem active'
									: 'homeTopbarItem'
							}
							onClick={() => setActiveSwitch('following')}
						>
							Following
						</div>
					</div>
				</div>

				{/* component, where you create posts */}

				<Share
					activeEdit={activeEdit}
					setActiveEdit={setActiveEdit}
					activeEditCircle={activeEditCircle}
					setActiveEditCircle={setActiveEditCircle}
					activeEditRec={activeEditRec}
					setActiveEditRec={setActiveEditRec}
					activeEditInput={activeEditInput}
					setActiveEditInput={setActiveEditInput}
					hasValue={hasValue}
					setHasValue={setHasValue}
					user={user}
					userInStorage={userInStorage}
				/>

				{/* timeline container */}

				<div
					className='homePostContainerBlock'
					style={{ height: userPosts.length < 11 ? '1424px' : 'fit-content' }}
				>
					{loadingPosts ? (
						<PostsLoader />
					) : activeSwitch === 'foryou' ? (
						Array.isArray(userPosts) ? (
							userPosts.map((post, index) => (
								<Posts
									key={index}
									post={post}
									more={PF + 'icon/utility/moreHorizontal.svg'}
									moreActive={PF + 'icon/utility/moreHorizontalActive.svg'}
									currentUser={user}
									isUserPosts={post.userId === user?._id ? true : false}
									activeFollowBtn={activeFollowBtn}
									setActiveFollowBtn={setActiveFollowBtn}
									unfollow={unfollow}
									setUnfollow={setUnfollow}
								/>
							))
						) : (
							<div className='noPosts'>
								<FaRegFaceSadTear fontSize={48} color='var(--gray)' />
								<p className='noPostsMessage'>
									Oops! No tweets to display. Try selecting more tags that match
									your interests, so we can find tweets for you.
								</p>
							</div>
						)
					) : activeSwitch === 'following' ? (
						followingPosts.map((post, index) => (
							<Posts
								key={index}
								post={post}
								more={PF + 'icon/utility/moreHorizontal.svg'}
								moreActive={PF + 'icon/utility/moreHorizontalActive.svg'}
								currentUser={user}
								isUserPosts={post.userId === user?._id ? true : false}
								activeFollowBtn={activeFollowBtn}
								setActiveFollowBtn={setActiveFollowBtn}
								unfollow={unfollow}
								setUnfollow={setUnfollow}
								retweetedBy={post.retweetedBy}
							/>
						))
					) : (
						<div className='noPosts'>
							<FaRegFaceSadTear fontSize={48} color='var(--gray)' />
							<p className='noPostsMessage'>
								Oops! No posts to display. Try following other users to see
								their posts.
							</p>
						</div>
					)}
				</div>
			</div>
			{/* rightbar with trends  */}
			<div>
				<Actual registered user={user} />
				<WhoToFollow />
			</div>
		</Layout>
	)
}

export default Home
