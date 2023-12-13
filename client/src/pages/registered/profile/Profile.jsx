// importing css file, components, custom and react hooks, user context, axios and momentJS libraries

import './profile.css'

import {
	Actual,
	WhoToFollow,
	PostsLoader,
	Input,
	Layout,
} from '../../../components/index'
import { useEffect, useState, useContext } from 'react'
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link,
	useLocation,
	NavLink,
	useParams,
	useNavigate,
} from 'react-router-dom'

import { Posts } from './../../../components/index'

import { useOutsideClick } from '../../../utils/useOutsideClick'

import { UserContext } from '../../../context/UserContext'
import { useLocalStorage } from '../../../utils/useLocalStorage'
import axios from 'axios'
import moment from 'moment'
import { FiMoreHorizontal } from 'react-icons/fi'
import { LuBellPlus } from 'react-icons/lu'
import { AiOutlineMail } from 'react-icons/ai'
import { ProfileFollowing } from './profile-follow/ProfileFollowing'
import { ProfileFollowers } from './profile-follow/ProfileFollowers'
import { ProfileTopics } from './profile-topics/ProfileTopics'
import { ProfileTopicsNotInterested } from './profile-topics/ProfileTopicsNotInterested'
import { ProfileLists } from '../../../components/lists/profile-lists/ProfileLists'
import { ProfileListsMembership } from '../../../components/lists/profile-lists/ProfileListsMembership'
import PostPage from '../../../components/posts/postPage/PostPage'
import CreateListModal from '../../../components/lists/createListModal/CreateListModal'
import { tags } from '../../../helpers/tags'
import TagItem from '../../../components/tags/tagItem/TagItem'

const Profile = ({ isLoading, setIsLoading }) => {
	// declaring states of modal windows

	const [activeAddList, setActiveAddList] = useState(false)

	// declaring location variable using react-router-dom

	const location = useLocation()
	const navigate = useNavigate()

	// declaring variable that helps to get images from folder directly without importing

	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	// removes scrollbar when modal windows are open

	activeAddList
		? (document.body.style.overflowY = 'hidden')
		: (document.body.style.overflowY = 'inherit')

	// declaring states of custom input fields

	const [inputEditName, setInputEditName] = useState({
		active: false,
		hasValue: false,
		label: '',
		value: '',
		maxCount: '50',
		name: 'Name',
		editProfile: true,
	})

	const [inputEditBio, setInputEditBio] = useState({
		active: false,
		hasValue: false,
		label: '',
		value: '',
		maxCount: '160',
		name: 'Bio',
		editProfile: true,
	})

	const [inputEditLocation, setInputEditLocation] = useState({
		active: false,
		hasValue: false,
		label: '',
		value: '',
		maxCount: '30',
		name: 'Location',
		editProfile: true,
	})

	const [inputEditWebsite, setInputEditWebsite] = useState({
		active: false,
		hasValue: false,
		label: '',
		value: '',
		maxCount: '100',
		name: 'Website',
		editProfile: true,
	})

	// user data states

	const { user, setUser } = useContext(UserContext)
	const [anotherUser, setAnotherUser] = useState(null)
	const [userInStorage, setUserInStorage] = useLocalStorage('user')

	const params = useParams()

	// fetches user from local storage

	useEffect(() => {
		const fetchUser = async () => {
			const findUser = await axios.get(`/users/findByToken/${userInStorage}`)
			setUser(findUser.data)
		}
		!user && fetchUser()
	}, [userInStorage])

	useEffect(() => {
		const findAnotherUser = async () => {
			await axios
				.get(`/users/findById/${params.userId}`)
				.then(res => setAnotherUser(res.data))
				.catch(() => setAnotherUser(undefined))
		}
		params.userId !== anotherUser?.userId && findAnotherUser()
	}, [params.userId, anotherUser?.userId])

	useEffect(() => {
		!location.pathname.match('@') && navigate('/404')
	}, [location.pathname])

	// sets user data to inputs inside of modal window

	useEffect(() => {
		setInputEditName(prev => ({
			...prev,
			value: user?.username,
		}))
		if (user?.username)
			setInputEditName(prev => ({
				...prev,
				hasValue: true,
			}))

		setInputEditBio(prev => ({
			...prev,
			value: user?.bio,
		}))
		if (user?.bio)
			setInputEditBio(prev => ({
				...prev,
				hasValue: true,
			}))

		setInputEditLocation(prev => ({
			...prev,
			value: user?.location,
		}))
		if (user?.location)
			setInputEditLocation(prev => ({
				...prev,
				hasValue: true,
			}))

		setInputEditWebsite(prev => ({
			...prev,
			value: user?.website,
		}))
		if (user?.website)
			setInputEditWebsite(prev => ({
				...prev,
				hasValue: true,
			}))
	}, [user])

	anotherUser
		? (document.title = `${anotherUser?.username} (${anotherUser?.userId})`)
		: (document.title = 'Profile / Twitter')

	// fetches user's posts from database

	const [userPosts, setUserPosts] = useState([])

	const findUserPosts = async () => {
		setLoadingPosts(true)
		setActivePosts('tweets')
		setUserPosts([])
		try {
			const userAllPosts = await axios.get(
				`/posts/allUserPosts/${anotherUser?.userId.split('@')[1]}`
			)

			const sortedUserPosts = userAllPosts.data.sort((p1, p2) => {
				return new Date(p2.createdAt) - new Date(p1.createdAt)
			})

			const pinnedPostValue = user?.pinnedPost
			if (pinnedPostValue) {
				const index = sortedUserPosts.findIndex(
					item => item._id === pinnedPostValue
				)
				if (index !== -1) {
					const pinnedPost = sortedUserPosts.splice(index, 1)[0]
					sortedUserPosts.unshift(pinnedPost)
				}
			}

			setUserPosts(sortedUserPosts)
		} catch (err) {
			console.log(err)
		}
		setLoadingPosts(false)
	}

	useEffect(() => {
		anotherUser?.userId && user?.userId && findUserPosts()
	}, [anotherUser?.userId, user?.userId])

	// declaring states in "updating user data" modal window

	const [activeEditProfileBlock, setActiveEditProfileBlock] = useState(false)

	useEffect(() => {
		activeEditProfileBlock
			? (document.body.style.overflowY = 'hidden')
			: (document.body.style.overflowY = 'scroll')
	}, [activeEditProfileBlock])

	const [imgFile, setImgFile] = useState()

	const [currentAva, setCurrentAva] = useState()

	const [coverFile, setCoverFile] = useState()

	const [currentCover, setCurrentCover] = useState()

	// functions that changes current user avatar (not in the database)

	const changeUserAvatar = async e => {
		try {
			setImgFile(e.target.files[0])

			const formData = new FormData()
			const fileName =
				'a' +
				Math.random().toString(16).slice(2) +
				'.' +
				e.target.files[0]?.name.split('.')[1]

			formData.append('name', fileName)
			formData.append('files', e.target.files[0])

			await axios.post(`/upload`, formData)

			setCurrentAva(fileName)
		} catch (err) {
			console.log(err)
		}
	}

	// functions that changes current user cover (not in the database)

	const changeUserCover = async e => {
		try {
			setCoverFile(e.target.files[0])

			const formData = new FormData()
			const fileName =
				'c' +
				Math.random().toString(16).slice(2) +
				'.' +
				e.target.files[0]?.name.split('.')[1]

			formData.append('name', fileName)
			formData.append('files', e.target.files[0])

			await axios.post(`/upload`, formData)

			setCurrentCover(fileName)
		} catch (err) {
			console.log(err)
		}
	}

	// saves changes in user's data in database

	const saveUserData = async () => {
		const d = document.getElementById('day').value
		const m = document.getElementById('month').value
		const y = document.getElementById('year').value

		const fullDate = d + '.' + moment().month(m).format('M') + '.' + y

		if (
			imgFile ||
			(coverFile && !coverFile?.name.match('undefined')) ||
			currentCover === 'none' ||
			(user?.birth !== fullDate && activeBirthChange) ||
			user?.username !== inputEditName.value ||
			user?.bio !== inputEditBio.value ||
			user?.location !== inputEditLocation.value ||
			user?.website !== inputEditWebsite.value
		) {
			try {
				const formData = new FormData()
				const fileName =
					'a' +
					Math.random().toString(16).slice(2) +
					'.' +
					imgFile?.name.split('.')[1]
				const coverName =
					'c' +
					Math.random().toString(16).slice(2) +
					'.' +
					coverFile?.name.split('.')[1]

				if (imgFile) {
					formData.append('name', fileName)
					formData.append('files', imgFile)
				}

				if (coverFile) {
					formData.append('name', coverName)
					formData.append('files', coverFile)
				}

				await axios.post(`/upload`, formData)

				await axios.put(`/users/${user?.userId}/update`, {
					username: inputEditName.value,
					bio: inputEditBio.value,
					location: inputEditLocation.value,
					website: inputEditWebsite.value,
					profilePicture: !fileName.match('undefined')
						? fileName
						: user?.profilePicture,
					coverPicture:
						currentCover === 'none'
							? ''
							: !coverName.match('undefined')
							? coverName
							: user?.coverPicture,
					birth: fullDate,
				})

				document.location.reload()
			} catch (err) {
				console.log(err)
			}
		}
		setActiveEditProfileBlock(false)
	}

	// declaring states of full screen user avatar and cover

	const [userAvaFullScreen, openUserAvaFullScreen] = useState(false)

	const userAvatar = useOutsideClick(() => openUserAvaFullScreen(false))

	const [userCoverFullScreen, openUserCoverFullScreen] = useState(false)

	const userCover = useOutsideClick(() => openUserCoverFullScreen(false))

	// removes scrollbar when user's avatar or cover opened on full screen

	useEffect(() => {
		userAvaFullScreen || userCoverFullScreen
			? (document.body.style.overflowY = 'hidden')
			: (document.body.style.overflowY = 'scroll')
	}, [userAvaFullScreen, userCoverFullScreen])

	if (!activeEditProfileBlock && currentCover === 'none')
		setCurrentCover(anotherUser?.coverPicture)

	// fetches posts liked by user

	const [activePosts, setActivePosts] = useState('tweets')

	const [likedPosts, setLikedPosts] = useState([])

	const findLikedPosts = async () => {
		setLoadingPosts(true)
		setActivePosts('likes')
		setLikedPosts([])
		try {
			await axios.get(`/users/userLikedPosts/${anotherUser?._id}`).then(res => {
				let likedPosts = res.data
				const pinnedPost = likedPosts.find(
					item => user?.pinnedPost === item._id
				)

				if (pinnedPost) {
					likedPosts = likedPosts.filter(item => user?.pinnedPost !== item._id)
					likedPosts.unshift(pinnedPost)
					setLikedPosts(likedPosts)
				}
			})
		} catch (error) {
			console.log(error)
		}
		setLoadingPosts(false)
	}

	// block with changing user birth

	const [activeBirthChange, setActiveBirthChange] = useState(false)

	// transforms month number to month name

	function getMonthName(monthNumber) {
		const date = new Date()
		date.setMonth(monthNumber - 1)

		return date.toLocaleString('en-US', { month: 'long' })
	}

	// simplifies writing every year since 1904 etc.

	const getList = type => {
		if (type === 'year') {
			const year = 1904
			return Array.from(new Array(120), (v, i) => (
				<option
					key={i}
					selected={
						Number(user?.birth.split('.')[2]) === year + i ? true : false
					}
					value={year + i}
				>
					{year + i}
				</option>
			))
		} else if (type === 'day') {
			return Array.from(new Array(31), (v, i) => (
				<option
					key={i}
					selected={Number(user?.birth.split('.')[0]) === i + 1 ? true : false}
					value={i + 1}
				>
					{i + 1}
				</option>
			))
		} else if (type === 'month') {
			return Array.from(new Array(12), (v, i) => (
				<option
					key={i}
					selected={Number(user?.birth.split('.')[1]) === i + 1 ? true : false}
					value={getMonthName(i + 1)}
				>
					{getMonthName(i + 1)}
				</option>
			))
		}
	}

	// declaring states of birth date inputs

	const [activeMonth, setActiveMonth] = useState(false)
	const monthSelect = useOutsideClick(() => setActiveMonth(false))

	const [activeDay, setActiveDay] = useState(false)
	const daySelect = useOutsideClick(() => setActiveDay(false))

	const [activeYear, setActiveYear] = useState(false)
	const yearSelect = useOutsideClick(() => setActiveYear(false))

	const [activeFollowBtn, setActiveFollowBtn] = useState('Following')

	const followUser = async () => {
		if (user?.following.includes(anotherUser?._id)) {
			try {
				await axios.put(`/users/${anotherUser?._id}/unfollow`, {
					userId: user?._id,
				})
				setActiveFollowBtn('Follow')
				user.following = user.following.filter(
					item => item !== anotherUser?._id
				)
				anotherUser.followers = anotherUser?.followers.filter(
					item => item !== user?._id
				)
			} catch (err) {
				console.log(err)
			}
		} else if (!user?.following.includes(anotherUser?._id)) {
			try {
				await axios.put(`/users/${anotherUser?._id}/follow`, {
					userId: user?._id,
				})
				setActiveFollowBtn('Following')
				user.following.push(anotherUser?._id)
				anotherUser.followers.push(user?._id)

				const newNotification = await axios.post('/notifications', {
					receiver: anotherUser?._id,
					type: 'follow',
					sender: user?._id,
				})
				await axios.put(`/notifications/${anotherUser?._id}/add`, {
					notificationId: newNotification.data._id,
				})
			} catch (err) {
				console.log(err)
			}
		}
	}

	useEffect(() => {
		user?.following.includes(anotherUser?._id)
			? setActiveFollowBtn('Following')
			: setActiveFollowBtn('Follow')
	}, [user?.following, anotherUser?._id])

	const [unfollow, setUnfollow] = useState(false)

	useEffect(() => {
		if (!unfollow) return
		setActiveFollowBtn('Follow')
		setUnfollow(false)
		user.following = user.following.filter(item => item !== anotherUser?._id)
		anotherUser.followers = anotherUser?.followers.filter(
			item => item !== user?._id
		)
	}, [unfollow])

	const [replies, setReplies] = useState([])

	const findUserReplies = async () => {
		try {
			setLoadingPosts(true)
			setActivePosts('replies')
			setReplies([])
			await axios
				.get(`/users/userReplies/${anotherUser?._id}`)
				.then(comments => setReplies(comments.data))
			await findPinnedPost()
			setLoadingPosts(false)
		} catch (error) {
			console.log(error)
		}
	}

	const findPinnedPost = async () => {
		await axios
			.get(`/posts/${user?.pinnedPost}`)
			.then(res => setReplies(prev => [res.data, ...prev]))
	}

	const [loadingPosts, setLoadingPosts] = useState(true)

	const [postsWithMedia, setPostsWithMedia] = useState([])

	const findUserPostsWithMedia = async () => {
		setLoadingPosts(true)
		setActivePosts('media')
		setPostsWithMedia([])
		try {
			const posts = await axios.get(`/users/media/${anotherUser?._id}`)

			const pinnedPostValue = user?.pinnedPost
			if (pinnedPostValue) {
				const index = posts.data.findIndex(item => item._id === pinnedPostValue)
				if (index !== -1) {
					const pinnedPost = posts.data.splice(index, 1)[0]
					posts.data.unshift(pinnedPost)
				}
			}

			setPostsWithMedia(posts.data)
		} catch (error) {
			console.log(error)
		}
		setLoadingPosts(false)
	}

	const [userTags, setUserTags] = useState(user?.tags || [])
	const [chosenTags, setChosenTags] = useState([])
	const [areEqual, setAreEqual] = useState(true)

	useEffect(() => {
		setAreEqual(areArraysEqual(userTags, chosenTags))
	}, [userTags, chosenTags])

	useEffect(() => {
		if (user?.tags.length > 0 && userTags.length === 0) {
			setUserTags(user?.tags)
			setChosenTags(user?.tags)
		}
	}, [user, userTags])

	function areArraysEqual(array1, array2) {
		if (array1.length !== array2.length) {
			return false
		}

		const sortedArray1 = array1.slice().sort()
		const sortedArray2 = array2.slice().sort()

		return sortedArray1.every(
			(element, index) => element === sortedArray2[index]
		)
	}

	const editTags = async () => {
		try {
			await axios.put(`/users/${user?._id}/tags`, {
				tags: chosenTags,
			})
			setUserTags(chosenTags)
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
			{user && anotherUser !== undefined ? (
				<div className='profileMain'>
					<div className='profileContainer'>
						{/* top container in profile page */}
						<div
							className='profileTop'
							style={{
								display:
									location.pathname === `/${params.userId}/topics` ||
									location.pathname === `/${params.userId}/lists` ||
									location.pathname === `/${params.userId}/lists/membership` ||
									location.pathname === `/${params.userId}/topics/followed` ||
									location.pathname ===
										`/${params.userId}/topics/not_interested` ||
									location.pathname.match('status')
										? 'none'
										: 'block',
							}}
						>
							<h2 className='profileTopTitle'>{anotherUser?.username}</h2>
							<span className='profileTopTweetsCounter'>
								{location.pathname === `/${params.userId}/following` ||
								location.pathname === `/${params.userId}/followers`
									? `${params.userId}`
									: activePosts === 'media'
									? `${postsWithMedia.length} Photos & videos`
									: activePosts === 'likes' && likedPosts.length === 1
									? `${likedPosts.length} Like`
									: activePosts === 'likes' && likedPosts.length > 1
									? `${likedPosts.length} Likes`
									: activePosts === 'likes' && likedPosts.length === 0
									? `0 Likes`
									: `${userPosts.length} Tweets`}
							</span>
						</div>
						{/* routes to different pages inside profile */}
						<Routes>
							<Route
								path='/followers'
								element={
									<ProfileFollowers user={user} anotherUser={anotherUser} />
								}
							/>
							<Route
								path='/following'
								element={
									<ProfileFollowing user={user} anotherUser={anotherUser} />
								}
							/>
							<Route path='/topics' element={<ProfileTopics user={user} />} />
							<Route
								path='/topics/followed'
								element={<ProfileTopics user={user} />}
							/>
							<Route
								path='/topics/not_interested'
								element={<ProfileTopicsNotInterested user={user} />}
							/>
							<Route
								path='/lists'
								element={
									<ProfileLists
										user={user}
										setActiveAddList={setActiveAddList}
									/>
								}
							/>
							<Route
								path='/lists/membership'
								element={<ProfileListsMembership user={user} />}
							/>
							<Route
								path='/status/:postId'
								element={
									<PostPage
										unfollow={unfollow}
										setUnfollow={setUnfollow}
										activeFollowBtn={activeFollowBtn}
										setActiveFollowBtn={setActiveFollowBtn}
									/>
								}
							/>
						</Routes>
						{/* main content in page */}
						<div
							className='profileMainBlock'
							style={{
								display:
									location.pathname === `/${params.userId}/following` ||
									location.pathname === `/${params.userId}/followers` ||
									location.pathname === `/${params.userId}/topics` ||
									location.pathname === `/${params.userId}/lists` ||
									location.pathname === `/${params.userId}/lists/membership` ||
									location.pathname === `/${params.userId}/topics/followed` ||
									location.pathname ===
										`/${params.userId}/topics/not_interested` ||
									location.pathname.match('status')
										? 'none'
										: 'block',
							}}
						>
							{/* displays user cover and avatar */}
							<div className='profilebackgroundBlock'>
								<img
									className='profileBackground'
									src={
										user && !anotherUser
											? PF + 'storage/' + user?.coverPicture
											: anotherUser &&
											  anotherUser?.coverPicture &&
											  PF + 'storage/' + anotherUser?.coverPicture
									}
									alt=''
									onClick={() => openUserCoverFullScreen(true)}
								/>
								<div
									className='profileUserAva'
									onClick={() => openUserAvaFullScreen(true)}
								>
									<img
										src={
											user && !anotherUser
												? PF + 'storage/' + user?.profilePicture
												: anotherUser && anotherUser?.profilePicture
												? PF + 'storage/' + anotherUser?.profilePicture
												: PF + 'icon/noAvatar.png'
										}
										alt=''
									/>
									<div className='overlay'></div>
								</div>
							</div>
							{/* full screen user cover */}
							{userCoverFullScreen && (
								<div className='userAvaFullScreen'>
									<div className='fullScreenImgCross' title='Close'>
										<img src={PF + 'icon/utility/xWhite.svg'} alt='' />
									</div>
									<img
										className='userAvaImg'
										src={
											user && !anotherUser
												? PF + 'storage/' + user?.coverPicture
												: PF + 'storage/' + anotherUser?.coverPicture
										}
										ref={userCover}
									/>
									<div className='userAvaFullScreenOverlay'></div>
								</div>
							)}
							{/* full screen user avatar */}
							{userAvaFullScreen && (
								<div className='userAvaFullScreen'>
									<div className='fullScreenImgCross' title='Close'>
										<img src={PF + 'icon/utility/xWhite.svg'} alt='' />
									</div>
									<img
										className='userAvaImg'
										src={
											user && !anotherUser
												? PF + 'storage/' + user?.profilePicture
												: PF + 'storage/' + anotherUser?.profilePicture
										}
										ref={userAvatar}
									/>
									<div className='userAvaFullScreenOverlay'></div>
								</div>
							)}
							{/* user's name, id, bio, location, website, followings and followers */}
							<div className='profileUserInfo'>
								{anotherUser?.userId === user?.userId ? (
									<button
										className='editProfile'
										onClick={() => setActiveEditProfileBlock(true)}
									>
										Edit profile
									</button>
								) : (
									<div
										className='anotherProfileBlock'
										style={{
											left: activeFollowBtn !== 'Follow' ? '370px' : '414px',
										}}
									>
										<button className='editProfileButtons'>
											<FiMoreHorizontal />
										</button>

										{activeFollowBtn !== 'Follow' && (
											<button className='editProfileButtons'>
												{user?.followers.includes(anotherUser?._id) &&
												user?.following.includes(anotherUser?._id) ? (
													<AiOutlineMail />
												) : (
													<LuBellPlus />
												)}
											</button>
										)}

										<button
											className={
												activeFollowBtn === 'Unfollow'
													? 'editProfileButtons following redButton'
													: activeFollowBtn === 'Follow'
													? 'editProfileButtons following blackButton'
													: 'editProfileButtons following'
											}
											onMouseOver={() => {
												activeFollowBtn !== 'Follow' &&
													setActiveFollowBtn('Unfollow')
											}}
											onMouseOut={() => {
												activeFollowBtn !== 'Follow' &&
													setActiveFollowBtn('Following')
											}}
											onClick={() => followUser()}
										>
											{activeFollowBtn}
										</button>
									</div>
								)}

								<h1
									className='profileUsername'
									style={{
										marginTop:
											anotherUser?.userId !== user?.userId ? '40px' : '70px',
									}}
								>
									{user && !anotherUser
										? user?.username
										: anotherUser?.username}
								</h1>
								<p className='profileUserId'>
									{user && !anotherUser
										? user?.username
										: anotherUser?.username}
								</p>
								<p className='profileBio'>
									{user && !anotherUser ? user?.bio : anotherUser?.bio}
								</p>
								<div className='profileLocationAndJoined'>
									{user && !anotherUser
										? user?.location
										: anotherUser?.location && (
												<span className='profileUserJoined'>
													<img src={PF + 'icon/colored/gpsGray.svg'} alt='' />
													{user && !anotherUser
														? user?.location
														: anotherUser?.location}
												</span>
										  )}
									{user && !anotherUser
										? user?.website
										: anotherUser?.website && (
												<span className='profileUserJoined'>
													<img
														src={PF + 'icon/common/link.svg'}
														alt=''
														style={{ transform: 'rotate(-45deg)' }}
													/>
													<a
														href={
															user && !anotherUser
																? user?.website
																: anotherUser?.website
														}
														target='_blank'
													>
														{user && !anotherUser
															? user?.website
															: anotherUser?.website}
													</a>
												</span>
										  )}
									<span className='profileUserJoined'>
										<img src={PF + 'icon/common/calendarGray.svg'} alt='' />
										Joined{' '}
										{moment(user?.createdAt).format('MMMM') +
											' ' +
											moment(user?.createdAt).format('YYYY')}
									</span>
								</div>
								<div className='followsBlock'>
									<Link to={`/${params?.userId}/following`}>
										<span>
											<strong>
												{user && !anotherUser
													? user?.following.length
													: anotherUser?.following.length}
											</strong>{' '}
											Following
										</span>
									</Link>
									<Link to={`/${params?.userId}/followers`}>
										<span>
											<strong>
												{user && !anotherUser
													? user?.followers.length
													: anotherUser?.followers.length}
											</strong>{' '}
											Followers
										</span>
									</Link>
								</div>
							</div>
							{/* switch menu */}
							<div className='profileSwitchBlock'>
								<div
									className={
										activePosts === 'tweets'
											? 'profileSwitchItem active'
											: 'profileSwitchItem'
									}
									onClick={findUserPosts}
								>
									Tweets
								</div>
								<div
									className={
										activePosts === 'replies'
											? 'profileSwitchItem active'
											: 'profileSwitchItem'
									}
									onClick={findUserReplies}
								>
									Replies
								</div>
								<div
									className={
										activePosts === 'media'
											? 'profileSwitchItem active'
											: 'profileSwitchItem'
									}
									onClick={findUserPostsWithMedia}
								>
									Media
								</div>
								<div
									className={
										activePosts === 'likes'
											? 'profileSwitchItem active'
											: 'profileSwitchItem'
									}
									onClick={findLikedPosts}
								>
									Likes
								</div>
							</div>
						</div>
					</div>
					{/* edit user data modal window */}
					<div
						className='editProfileBlock'
						style={{ display: !activeEditProfileBlock && 'none' }}
					>
						<div className='editProfileContainer'>
							<div className='editProfileTop'>
								<div
									className='editProfileCross'
									title='Close'
									onClick={() => setActiveEditProfileBlock(false)}
								>
									<img src={PF + 'icon/utility/x.svg'} alt='' />
								</div>
								<h1>Edit profile</h1>
								<button onClick={saveUserData}>Save</button>
							</div>
							{/* edit cover */}
							<div className='editProfileBackgroundBlock'>
								{currentCover === 'none' ? (
									false
								) : currentCover && !currentCover.match('undefined') ? (
									<div className='currentCover'>
										<img
											src={PF + 'storage/' + currentCover}
											alt=''
											className='coverImg'
										/>
										<div className='currentCoverOverlay'></div>
									</div>
								) : (
									user?.coverPicture && (
										<div className='currentCover'>
											<img
												src={PF + 'storage/' + user?.coverPicture}
												alt=''
												className='coverImg'
											/>
											<div className='currentCoverOverlay'></div>
										</div>
									)
								)}
								<div className='editProfileBackgroundAddPhotoIcons'>
									<label
										htmlFor='userCover'
										className='editProfileBackgroundAddPhotoBlock'
									>
										<img src={PF + 'icon/common/camera.svg'} alt='' />
										<input
											type='file'
											hidden
											id='userCover'
											onChange={e => changeUserCover(e)}
										/>
									</label>
									{currentCover === 'none' ? (
										false
									) : currentCover && !currentCover.match('undefined') ? (
										<div
											className='editProfileBackgroundAddPhotoBlock'
											onClick={() => setCurrentCover()}
										>
											<img src={PF + 'icon/utility/xWhite.svg'} alt='' />
										</div>
									) : (
										user?.coverPicture && (
											<div
												className='editProfileBackgroundAddPhotoBlock'
												onClick={() => {
													setCurrentCover('none')
												}}
											>
												<img src={PF + 'icon/utility/xWhite.svg'} alt='' />
											</div>
										)
									)}
								</div>
							</div>
							{/* edit avatar */}
							<div className='editProfileUserAvaBlock'>
								<img
									className='userAvaImg'
									src={
										currentAva
											? PF + 'storage/' + currentAva
											: !user?.profilePicture
											? PF + 'icon/noAvatar.png'
											: PF + 'storage/' + user?.profilePicture
									}
									alt=''
								/>
								<div className='editProfileUserAvaOverlay'>
									<label
										className='editProfileBackgroundAddPhotoBlock'
										htmlFor='avaInput'
									>
										<input
											type='file'
											id='avaInput'
											hidden
											onChange={e => changeUserAvatar(e)}
										/>
										<img src={PF + 'icon/common/camera.svg'} alt='' />
									</label>
								</div>
							</div>
							{/* edit name, bio, location and website */}
							<div className='editProfileInputs'>
								<Input
									inputState={inputEditName}
									setInputState={setInputEditName}
								/>

								<Input
									inputState={inputEditBio}
									setInputState={setInputEditBio}
								/>

								<Input
									inputState={inputEditLocation}
									setInputState={setInputEditLocation}
								/>

								<Input
									inputState={inputEditWebsite}
									setInputState={setInputEditWebsite}
								/>

								{/* edit birth date */}

								<div
									className='birthDate'
									style={{ display: !activeBirthChange ? 'block' : 'none' }}
								>
									<div className='birthDateTop'>
										<span className='birthDateTitle'>Birth date</span>
										<span className='middleDot'>·</span>
										<span
											className='birdtDateEdit'
											onClick={() => setActiveBirthChange(true)}
										>
											Edit
										</span>
									</div>
									<div className='birthDateBottom'>
										{moment(user?.birth.split('.')[1]).format('MMMM') +
											' ' +
											user?.birth.split('.')[0] +
											', ' +
											user?.birth.split('.')[2]}
									</div>
								</div>
								<div
									className='birthDateChanging'
									style={{ display: activeBirthChange ? 'block' : 'none' }}
								>
									<div className='birthDateTop'>
										<span
											className='birthDateTitle'
											style={{ fontWeight: '700', color: '#0f1419' }}
										>
											Birth date
										</span>
										<span className='middleDot'>·</span>
										<span
											className='birdtDateEdit'
											onClick={() => setActiveBirthChange(false)}
										>
											Cancel
										</span>
									</div>
									<div className='birthDateChangingDesc'>
										<p>
											This should be the date of birth of the person using the
											account. Even if you’re making an account for your
											business, event, or cat.
											<br />
											<br />
											Twitter uses your age to customize your experience,
											including ads, as explained in our{' '}
											<span>Privacy Policy</span>.
										</p>
									</div>
									{/* inputs that changes user's birth date */}
									<div className='formBottomInputBlock'>
										<div
											ref={monthSelect}
											className='formBottomSelectBlock'
											style={{
												borderColor: activeMonth ? '#1D9BF0' : '#CFD9DE',
											}}
										>
											<label
												style={{ color: activeMonth ? '#1D9BF0' : '#536471' }}
												htmlFor='month'
												onClick={() => setActiveMonth(true)}
											>
												Month
											</label>
											<select id='month' onClick={() => setActiveMonth(true)}>
												{getList('month')}
											</select>
											<svg
												className='selectChevron'
												xmlns='http://www.w3.org/2000/svg'
												width='50'
												height='50'
												viewBox='0 0 24 24'
												fill='none'
												stroke={activeMonth ? '#1D9BF0' : '#494E51'}
												strokeWidth='1.5'
												strokeLinecap='round'
												strokeLinejoin='round'
											>
												<polyline points='6 9 12 15 18 9'></polyline>
											</svg>
										</div>
										<div
											ref={daySelect}
											className='formBottomSelectBlock'
											style={{
												borderColor: activeDay ? '#1D9BF0' : '#CFD9DE',
												width: '96px',
											}}
										>
											<label
												style={{ color: activeDay ? '#1D9BF0' : '#536471' }}
												htmlFor='day'
												onClick={() => setActiveDay(true)}
											>
												Day
											</label>
											<select
												id='day'
												style={{ width: '90px' }}
												onClick={() => setActiveDay(true)}
											>
												{getList('day')}
											</select>
											<svg
												className='selectChevron'
												xmlns='http://www.w3.org/2000/svg'
												width='50'
												height='50'
												viewBox='0 0 24 24'
												fill='none'
												stroke={activeDay ? '#1D9BF0' : '#494E51'}
												strokeWidth='1.5'
												strokeLinecap='round'
												strokeLinejoin='round'
											>
												<polyline points='6 9 12 15 18 9'></polyline>
											</svg>
										</div>
										<div
											ref={yearSelect}
											className='formBottomSelectBlock'
											style={{
												borderColor: activeYear ? '#1D9BF0' : '#CFD9DE',
												width: '118px',
											}}
										>
											<label
												style={{ color: activeYear ? '#1D9BF0' : '#536471' }}
												htmlFor='year'
												onClick={() => setActiveYear(true)}
											>
												Year
											</label>
											<select
												id='year'
												style={{ width: '118px' }}
												onClick={() => setActiveYear(true)}
											>
												{getList('year')}
											</select>
											<svg
												className='selectChevron'
												xmlns='http://www.w3.org/2000/svg'
												width='50'
												height='50'
												viewBox='0 0 24 24'
												fill='none'
												stroke={activeYear ? '#1D9BF0' : '#494E51'}
												strokeWidth='1.5'
												strokeLinecap='round'
												strokeLinejoin='round'
											>
												<polyline points='6 9 12 15 18 9'></polyline>
											</svg>
										</div>
									</div>
								</div>
							</div>
							<div className='profileTags'>
								<h2 className='profileTagsTitle'>Tags</h2>
								<span className='profileTagsDesc'>
									Tags help you find similar users, tweets, and communities
									based on your interests. Easily explore content and connect
									with like-minded individuals using these convenient labels.
								</span>
								<div className='profileTagsList'>
									{tags.map((tag, index) => (
										<TagItem
											key={index}
											tag={tag}
											chosenTags={chosenTags}
											setChosenTags={setChosenTags}
										/>
									))}
								</div>
								<button
									className={
										areEqual
											? 'profileTagsEditButton disabled'
											: 'profileTagsEditButton'
									}
									disabled={areEqual}
									onClick={() => editTags()}
								>
									Edit tags
								</button>
							</div>
						</div>
						<div
							className='overlay'
							onClick={() => setActiveEditProfileBlock(false)}
						/>
					</div>
					{/* container with posts (user's or liked by user) */}
					<div
						style={{
							display:
								location.pathname === `/${user?.userId}/following` ||
								location.pathname === `/${user?.userId}/followers` ||
								location.pathname === `/${user?.userId}/topics` ||
								location.pathname === `/${user?.userId}/lists` ||
								location.pathname.match('status')
									? 'none'
									: 'block',
						}}
					>
						{loadingPosts ? (
							<PostsLoader />
						) : activePosts === 'tweets' && userPosts?.length !== 0 ? (
							userPosts.map(
								(post, index) =>
									post?.originalPost === null && (
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
											retweetedBy={
												anotherUser.retweets.includes(post._id) &&
												anotherUser.username
											}
										/>
									)
							)
						) : activePosts === 'likes' && likedPosts?.length !== 0 ? (
							likedPosts?.map((post, index) => (
								<Posts
									key={index}
									post={post}
									more={PF + 'icon/utility/moreHorizontal.svg'}
									moreActive={PF + 'icon/utility/moreHorizontalActive.svg'}
									currentUser={user}
									isUserPosts={post.user._id === user?._id ? true : false}
									activeFollowBtn={activeFollowBtn}
									setActiveFollowBtn={setActiveFollowBtn}
									unfollow={unfollow}
									setUnfollow={setUnfollow}
									retweetedBy={
										anotherUser.retweets.includes(post._id) &&
										anotherUser.username
									}
								/>
							))
						) : activePosts === 'replies' && replies.length !== 0 ? (
							replies?.map((post, index) => (
								<>
									{user?.pinnedPost === post._id ? (
										<>
											<Posts
												key={index}
												post={post}
												more={PF + 'icon/utility/moreHorizontal.svg'}
												moreActive={
													PF + 'icon/utility/moreHorizontalActive.svg'
												}
												currentUser={user}
												isUserPosts={post.user._id === user?._id ? true : false}
												activeFollowBtn={activeFollowBtn}
												setActiveFollowBtn={setActiveFollowBtn}
												unfollow={unfollow}
												setUnfollow={setUnfollow}
												retweetedBy={
													anotherUser.retweets.includes(post._id) &&
													anotherUser.username
												}
											/>
											<hr className='postPageHr' />
										</>
									) : (
										<>
											<Posts
												key={index}
												post={post}
												more={PF + 'icon/utility/moreHorizontal.svg'}
												moreActive={
													PF + 'icon/utility/moreHorizontalActive.svg'
												}
												currentUser={user}
												isUserPosts={post.user._id === user?._id ? true : false}
												activeFollowBtn={activeFollowBtn}
												setActiveFollowBtn={setActiveFollowBtn}
												unfollow={unfollow}
												setUnfollow={setUnfollow}
												isReply={'original'}
												retweetedBy={
													anotherUser.retweets.includes(post._id) &&
													anotherUser.username
												}
											/>
											{post.replies.map(
												(reply, index2) =>
													reply.userId === anotherUser._id && (
														<div style={{ position: 'relative' }}>
															<hr className='verticalLine' />
															<Posts
																key={index + index2}
																post={reply}
																more={PF + 'icon/utility/moreHorizontal.svg'}
																moreActive={
																	PF + 'icon/utility/moreHorizontalActive.svg'
																}
																currentUser={anotherUser}
																isUserPosts={
																	reply.user._id === user?._id ? true : false
																}
																activeFollowBtn={activeFollowBtn}
																setActiveFollowBtn={setActiveFollowBtn}
																unfollow={unfollow}
																setUnfollow={setUnfollow}
																isReply={'reply'}
																retweetedBy={
																	anotherUser.retweets.includes(post._id) &&
																	anotherUser.username
																}
															/>
														</div>
													)
											)}
											<hr
												className='postPageHr'
												style={{ marginTop: '20px' }}
											/>
										</>
									)}
								</>
							))
						) : (
							activePosts === 'media' &&
							postsWithMedia.length !== 0 &&
							postsWithMedia?.map((post, index) => (
								<Posts
									key={index}
									post={post}
									more={PF + 'icon/utility/moreHorizontal.svg'}
									moreActive={PF + 'icon/utility/moreHorizontalActive.svg'}
									currentUser={user}
									isUserPosts={post.user._id === user?._id ? true : false}
									activeFollowBtn={activeFollowBtn}
									setActiveFollowBtn={setActiveFollowBtn}
									unfollow={unfollow}
									setUnfollow={setUnfollow}
									retweetedBy={
										anotherUser.retweets.includes(post._id) &&
										anotherUser.username
									}
								/>
							))
						)}
					</div>
				</div>
			) : (
				<div className='profileMain'>
					<div className='profileContainer' style={{ width: '600px' }}>
						<div className='profileTop'>
							<h2 className='profileTopTitle'>Profile</h2>
						</div>
						<div className='profileMainBlock'>
							<div className='profilebackgroundBlock'>
								<div className='profileUserAva'>
									<div
										style={{
											backgroundColor: '#f7f9f9',
											width: '133px',
											height: '133px',
											borderRadius: '50%',
											border: '5px solid #fff',
										}}
									/>
								</div>
							</div>
							<div className='profileUserInfo' style={{ marginTop: '100px' }}>
								<h1 className='profileUsername' style={{ marginTop: '-30px' }}>
									{params.userId}
								</h1>
							</div>
							<div className='accNotExistWrap'>
								<div className='accNotExistContainer'>
									<h1>This account doesn’t exist</h1>
									<p>Try searching for another.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
			<CreateListModal
				user={user}
				activeAddList={activeAddList}
				setActiveAddList={setActiveAddList}
			/>
			<div>
				<Actual registered />
				<WhoToFollow />
			</div>
		</Layout>
	)
}

export default Profile
