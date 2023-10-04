// importing css file, components, custom and react hooks, user context, axios and momentJS libraries

import './profile.css'

import {
	Sidebar,
	TwitterBlue,
	LogoutForm,
	LoginForm,
	Actual,
	WhoToFollow,
	VerifiedOrganizations,
	TwitterCircle,
	TwitterProfessionals,
	PostsLoader,
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
import { ProfileLists } from './profile-lists/ProfileLists'
import { ProfileListsMembership } from './profile-lists/ProfileListsMembership'
import PostPage from './postPage/PostPage'

const Profile = ({ isLoading, setIsLoading }) => {
	// declaring states of modal windows

	const [activeTwitterBlue, setActiveTwitterBlue] = useState(false)
	const [activeLogOut, setActiveLogOut] = useState(false)
	const [activeLoginForm, setActiveLoginForm] = useState(false)
	const [activeVerified, setActiveVerified] = useState(false)

	const [activeAddList, setActiveAddList] = useState(false)

	// declaring location variable using react-router-dom

	const location = useLocation()

	// declaring variable that helps to get images from folder directly without importing

	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	// removes scrollbar when modal windows are open

	activeLogOut ||
	activeLoginForm ||
	activeTwitterBlue ||
	activeVerified ||
	activeAddList
		? (document.body.style.overflowY = 'hidden')
		: (document.body.style.overflowY = 'inherit')

	// declaring states of custom input fields

	const [activeInputName, setActiveInputName] = useState(false)
	const [hasValueName, setHasValueName] = useState(false)
	const [activeLabelBlueName, setActiveLabelBlueName] = useState(false)
	const [activeLabelGrayName, setActiveLabelGrayName] = useState(false)
	const [inputNameValue, setInputNameValue] = useState('')

	const [activeInputDesc, setActiveInputDesc] = useState(false)
	const [hasValueDesc, setHasValueDesc] = useState(false)
	const [activeLabelBlueDesc, setActiveLabelBlueDesc] = useState(false)
	const [activeLabelGrayDesc, setActiveLabelGrayDesc] = useState(false)
	const [inputDescValue, setInputDescValue] = useState('')

	const [activeEdit, setActiveEdit] = useState(false)
	const [activeEditCircle, setActiveEditCircle] = useState(true)
	const [activeEditRec, setActiveEditRec] = useState(false)
	const [activeEditInput, setActiveEditInput] = useState(false)
	const [hasValue, setHasValue] = useState(false)
	const [activeProfessionals, setActiveProfessionals] = useState(false)

	const [activeInputEditName, setActiveInputEditName] = useState(false)
	const [hasValueEditName, setHasValueEditName] = useState(false)
	const [activeLabelBlueEditName, setActiveLabelBlueEditName] = useState(false)
	const [activeLabelGrayEditName, setActiveLabelGrayEditName] = useState(false)
	const [inputEditNameValue, setInputEditNameValue] = useState('')

	const [activeInputEditBio, setActiveInputEditBio] = useState(false)
	const [hasValueEditBio, setHasValueEditBio] = useState(false)
	const [activeLabelBlueEditBio, setActiveLabelBlueEditBio] = useState(false)
	const [activeLabelGrayEditBio, setActiveLabelGrayEditBio] = useState(false)
	const [inputEditBioValue, setInputEditBioValue] = useState('')

	const [activeInputEditWebsite, setActiveInputEditWebsite] = useState(false)
	const [hasValueEditWebsite, setHasValueEditWebsite] = useState(false)
	const [activeLabelBlueEditWebsite, setActiveLabelBlueEditWebsite] =
		useState(false)
	const [activeLabelGrayEditWebsite, setActiveLabelGrayEditWebsite] =
		useState(false)
	const [inputEditWebsiteValue, setInputEditWebsiteValue] = useState('')

	const [activeInputEditLocation, setActiveInputEditLocation] = useState(false)
	const [hasValueEditLocation, setHasValueEditLocation] = useState(false)
	const [activeLabelBlueEditLocation, setActiveLabelBlueEditLocation] =
		useState(false)
	const [activeLabelGrayEditLocation, setActiveLabelGrayEditLocation] =
		useState(false)
	const [inputEditLocationValue, setInputEditLocationValue] = useState('')

	// changes states of custom inputs

	useEffect(() => {
		if (activeInputName) {
			setActiveLabelBlueName(true)
			setActiveLabelGrayName(false)
		}
		if (hasValueName && !activeInputName) {
			setActiveLabelGrayName(true)
			setActiveLabelBlueName(false)
		}
		if (!hasValueName && !activeInputName) {
			setActiveLabelGrayName(false)
			setActiveLabelBlueName(false)
		}
	}, [activeInputName, hasValueName])

	useEffect(() => {
		if (activeInputDesc) {
			setActiveLabelBlueDesc(true)
			setActiveLabelGrayDesc(false)
		}
		if (hasValueDesc && !activeInputDesc) {
			setActiveLabelGrayDesc(true)
			setActiveLabelBlueDesc(false)
		}
		if (!hasValueDesc && !activeInputDesc) {
			setActiveLabelGrayDesc(false)
			setActiveLabelBlueDesc(false)
		}
	}, [activeInputDesc, hasValueDesc])

	useEffect(() => {
		if (activeInputEditName) {
			setActiveLabelBlueEditName(true)
			setActiveLabelGrayEditName(false)
		}
		if (hasValueEditName && !activeInputEditName) {
			setActiveLabelGrayEditName(true)
			setActiveLabelBlueEditName(false)
		}
		if (!hasValueEditName && !activeInputEditName) {
			setActiveLabelGrayEditName(false)
			setActiveLabelBlueEditName(false)
		}
	}, [activeInputEditName, hasValueEditName])

	useEffect(() => {
		if (activeInputEditBio) {
			setActiveLabelBlueEditBio(true)
			setActiveLabelGrayEditBio(false)
		}
		if (hasValueEditBio && !activeInputEditBio) {
			setActiveLabelGrayEditBio(true)
			setActiveLabelBlueEditBio(false)
		}
		if (!hasValueEditBio && !activeInputEditBio) {
			setActiveLabelGrayEditBio(false)
			setActiveLabelBlueEditBio(false)
		}
	}, [activeInputEditBio, hasValueEditBio])

	useEffect(() => {
		if (activeInputEditWebsite) {
			setActiveLabelBlueEditWebsite(true)
			setActiveLabelGrayEditWebsite(false)
		}
		if (hasValueEditWebsite && !activeInputEditWebsite) {
			setActiveLabelGrayEditWebsite(true)
			setActiveLabelBlueEditWebsite(false)
		}
		if (!hasValueEditWebsite && !activeInputEditWebsite) {
			setActiveLabelGrayEditWebsite(false)
			setActiveLabelBlueEditWebsite(false)
		}
	}, [activeInputEditWebsite, hasValueEditWebsite])

	useEffect(() => {
		if (activeInputEditLocation) {
			setActiveLabelBlueEditLocation(true)
			setActiveLabelGrayEditLocation(false)
		}
		if (hasValueEditLocation && !activeInputEditLocation) {
			setActiveLabelGrayEditLocation(true)
			setActiveLabelBlueEditLocation(false)
		}
		if (!hasValueEditLocation && !activeInputEditLocation) {
			setActiveLabelGrayEditLocation(false)
			setActiveLabelBlueEditLocation(false)
		}
	}, [activeInputEditLocation, hasValueEditLocation])

	const handleInputChange = (e, type) => {
		switch (type) {
			case 'name':
				setHasValueName(true)
				setInputNameValue(e.target.value)
				break
			case 'desc':
				setHasValueDesc(true)
				setInputDescValue(e.target.value)
				break
			case 'editName':
				setHasValueEditName(true)
				setInputEditNameValue(e.target.value)
				break
			case 'editBio':
				setHasValueEditBio(true)
				setInputEditBioValue(e.target.value)
				break
			case 'editLocation':
				setHasValueEditLocation(true)
				setInputEditLocationValue(e.target.value)
				break
			case 'editWebsite':
				setHasValueEditWebsite(true)
				setInputEditWebsiteValue(e.target.value)
				break
		}
	}

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
		fetchUser()
	}, [userInStorage])

	useEffect(() => {
		const anotherUser = async () => {
			const findUser = await axios.get(`/users/findById/${params.userId}`)
			setAnotherUser(findUser.data)
		}
		anotherUser()
	}, [params.userId])

	// sets user data to inputs inside of modal window

	useEffect(() => {
		setInputEditNameValue(user?.username)
		if (user?.username) setHasValueEditName(true)

		setInputEditBioValue(user?.bio)
		if (user?.bio) setHasValueEditBio(true)

		setInputEditLocationValue(user?.location)
		if (user?.location) setHasValueEditLocation(true)

		setInputEditWebsiteValue(user?.website)
		if (user?.website) setHasValueEditWebsite(true)
	}, [user])

	user
		? (document.title = `${anotherUser?.username} (${anotherUser?.userId})`)
		: (document.title = 'Profile / Twitter')

	// fetches user's posts from database

	const [userPosts, setUserPosts] = useState([])

	const findUserPosts = async () => {
		setActivePosts('tweets')
		setUserPosts([])
		try {
			const userAllPosts = await axios.get(
				`/posts/allUserPosts/${anotherUser?.userId.split('@')[1]}`
			)
			setUserPosts(
				userAllPosts.data.sort((p1, p2) => {
					return new Date(p2.createdAt) - new Date(p1.createdAt)
				})
			)
		} catch (err) {
			console.log(err)
		}
	}

	useEffect(() => {
		anotherUser?.userId && user?.userId && findUserPosts()
	}, [anotherUser?.userId, user?.userId])

	// declaring states in "updating user data" modal window

	const [activeEditProfileBlock, setActiveEditProfileBlock] = useState(false)

	activeEditProfileBlock
		? (document.body.style.overflowY = 'hidden')
		: (document.body.style.overflowY = 'scroll')

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
			user?.username !== inputEditNameValue ||
			user?.bio !== inputEditBioValue ||
			user?.location !== inputEditLocationValue ||
			user?.website !== inputEditWebsiteValue
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
					username: inputEditNameValue,
					bio: inputEditBioValue,
					location: inputEditLocationValue,
					website: inputEditWebsiteValue,
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

	userAvaFullScreen || userCoverFullScreen
		? (document.body.style.overflowY = 'hidden')
		: (document.body.style.overflowY = 'hiddeb')

	if (!activeEditProfileBlock && currentCover === 'none')
		setCurrentCover(anotherUser?.coverPicture)

	// fetches posts liked by user

	const [activePosts, setActivePosts] = useState('tweets')

	const [likedPosts, setLikedPosts] = useState([])

	const findLikedPosts = async () => {
		setActivePosts('likes')
		setLikedPosts([])
		const getUserLikedPosts = async () => {
			const userLikedPosts = await axios.get(
				`/users/userLikedPosts/${anotherUser?._id}`
			)
			setLikedPosts(userLikedPosts.data)
		}
		getUserLikedPosts()
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

	return (
		<div style={{ display: 'flex' }}>
			{/* sidebar with modal windows' states */}
			<Sidebar
				registered
				activeTwitterBlue={activeTwitterBlue}
				setActiveTwitterBlue={setActiveTwitterBlue}
				activeLogOut={activeLogOut}
				setActiveLogOut={setActiveLogOut}
				activeLoginForm={activeLoginForm}
				setActiveLoginForm={setActiveLoginForm}
				activeVerified={activeVerified}
				setActiveVerified={setActiveVerified}
				setActiveEdit={setActiveEdit}
				setActiveProfessionals={setActiveProfessionals}
				isLoading={isLoading}
				setIsLoading={setIsLoading}
				user={user}
				userInStorage={userInStorage}
			/>
			<div className='profileMain'>
				<div className='profileContainer'>
					{/* top container in profile page */}
					<div
						className='profileTop'
						style={{
							display:
								location.pathname === `/${params.userId}/topics` ||
								location.pathname === `/${params.userId}/lists` ||
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
								<ProfileLists user={user} setActiveAddList={setActiveAddList} />
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
								{user && !anotherUser ? user?.username : anotherUser?.username}
							</h1>
							<p className='profileUserId'>
								{user && !anotherUser ? user?.username : anotherUser?.username}
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
							<div className='profileSwitchItem'>Replies</div>
							<div className='profileSwitchItem'>Media</div>
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
							<div
								className={
									activeInputEditName
										? 'addListInputBlock nameInput active'
										: 'addListInputBlock nameInput'
								}
								onClick={() => setActiveInputEditName(true)}
								onBlur={() => setActiveInputEditName(false)}
							>
								<span
									className='addListInputCounter'
									style={{ display: activeInputEditName ? 'inline' : 'none' }}
								>
									{hasValueEditName === false &&
									inputEditNameValue?.length === 1
										? 0
										: inputEditNameValue?.length}{' '}
									/ 50
								</span>
								<label
									className={
										activeLabelBlueEditName
											? 'addListLabel activeBlue'
											: activeLabelGrayEditName
											? 'addListLabel active'
											: 'addListLabel'
									}
									htmlFor='editNameInput'
								>
									Name
								</label>
								<input
									maxLength={50}
									value={
										hasValueEditName === false &&
										inputEditNameValue?.length === 1
											? ''
											: inputEditNameValue
									}
									id='editNameInput'
									type='text'
									className='addListInput nameInput'
									onChange={e =>
										e.target.value
											? handleInputChange(e, 'editName')
											: setHasValueEditName(false)
									}
								/>
							</div>

							<div
								className={
									activeInputEditBio
										? 'addListInputBlock nameInput active bioInput'
										: 'addListInputBlock nameInput bioInput'
								}
								onClick={() => setActiveInputEditBio(true)}
								onBlur={() => setActiveInputEditBio(false)}
							>
								<span
									className='addListInputCounter'
									style={{ display: activeInputEditBio ? 'inline' : 'none' }}
								>
									{hasValueEditBio === false && inputEditBioValue?.length === 1
										? 0
										: inputEditBioValue?.length}{' '}
									/ 160
								</span>
								<label
									className={
										activeLabelBlueEditBio
											? 'addListLabel activeBlue'
											: activeLabelGrayEditBio
											? 'addListLabel active'
											: 'addListLabel inactive'
									}
									htmlFor='editBioInput'
								>
									Bio
								</label>
								<textarea
									maxLength={160}
									value={
										hasValueEditBio === false && inputEditBioValue?.length === 1
											? ''
											: inputEditBioValue
									}
									id='editBioInput'
									type='text'
									className='addListInput nameInput'
									onChange={e =>
										e.target.value
											? handleInputChange(e, 'editBio')
											: setHasValueEditBio(false)
									}
								/>
							</div>

							<div
								className={
									activeInputEditLocation
										? 'addListInputBlock nameInput active'
										: 'addListInputBlock nameInput'
								}
								onClick={() => setActiveInputEditLocation(true)}
								onBlur={() => setActiveInputEditLocation(false)}
							>
								<span
									className='addListInputCounter'
									style={{
										display: activeInputEditLocation ? 'inline' : 'none',
									}}
								>
									{hasValueEditLocation === false &&
									inputEditLocationValue?.length === 1
										? 0
										: inputEditLocationValue?.length}{' '}
									/ 30
								</span>
								<label
									className={
										activeLabelBlueEditLocation
											? 'addListLabel activeBlue'
											: activeLabelGrayEditLocation
											? 'addListLabel active'
											: 'addListLabel'
									}
									htmlFor='editLocationInput'
								>
									Location
								</label>
								<input
									maxLength={30}
									value={
										hasValueEditLocation === false &&
										inputEditLocationValue?.length === 1
											? ''
											: inputEditLocationValue
									}
									id='editLocationInput'
									type='text'
									className='addListInput nameInput'
									onChange={e =>
										e.target.value
											? handleInputChange(e, 'editLocation')
											: setHasValueEditLocation(false)
									}
								/>
							</div>

							<div
								className={
									activeInputEditWebsite
										? 'addListInputBlock nameInput active'
										: 'addListInputBlock nameInput'
								}
								onClick={() => setActiveInputEditWebsite(true)}
								onBlur={() => setActiveInputEditWebsite(false)}
							>
								<span
									className='addListInputCounter'
									style={{
										display: activeInputEditWebsite ? 'inline' : 'none',
									}}
								>
									{hasValueEditWebsite === false &&
									inputEditWebsiteValue?.length === 1
										? 0
										: inputEditWebsiteValue?.length}{' '}
									/ 100
								</span>
								<label
									className={
										activeLabelBlueEditWebsite
											? 'addListLabel activeBlue'
											: activeLabelGrayEditWebsite
											? 'addListLabel active'
											: 'addListLabel'
									}
									htmlFor='editWebsiteInput'
								>
									Website
								</label>
								<input
									maxLength={100}
									value={
										hasValueEditWebsite === false &&
										inputEditWebsiteValue?.length === 1
											? ''
											: inputEditWebsiteValue
									}
									id='editWebsiteInput'
									type='text'
									className='addListInput nameInput'
									onChange={e =>
										e.target.value
											? handleInputChange(e, 'editWebsite')
											: setHasValueEditWebsite(false)
									}
								/>
							</div>

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
										account. Even if you’re making an account for your business,
										event, or cat.
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
										style={{ borderColor: activeMonth ? '#1D9BF0' : '#CFD9DE' }}
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
					{activePosts === 'tweets' && userPosts?.length !== 0 ? (
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
							/>
						))
					) : activePosts === 'tweets' && userPosts?.length === 0 ? (
						<PostsLoader />
					) : activePosts === 'likes' && likedPosts?.length === 0 ? (
						<PostsLoader />
					) : (
						<div>Nothing to see here yet</div>
					)}
				</div>
			</div>
			{/* rightbar with trends */}
			<div>
				<Actual registered />
				<WhoToFollow />
			</div>
			{/* modal windows */}
			<TwitterBlue
				active={activeTwitterBlue}
				setActive={setActiveTwitterBlue}
			/>
			<LogoutForm active={activeLogOut} setActive={setActiveLogOut} />
			<LoginForm
				activeForm={activeLoginForm}
				setActiveForm={setActiveLoginForm}
			/>
			<VerifiedOrganizations
				active={activeVerified}
				setActive={setActiveVerified}
			/>
			<TwitterCircle
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
			/>
			<TwitterProfessionals
				active={activeProfessionals}
				setActive={setActiveProfessionals}
			/>
			{/* creating new list */}
			<form className={activeAddList ? 'addListBlock active' : 'addListBlock'}>
				<div className='addListBlockContainer'>
					<div className='addListTop'>
						<div className='addListTopLeft'>
							<div
								className='addListCrossBlock'
								onClick={() => setActiveAddList(false)}
							>
								<img src={PF + 'icon/utility/x.svg'} alt='' />
							</div>
							<span className='addListTitle'>Create a new List</span>
						</div>
						<button
							disabled={
								hasValueName === false && inputNameValue.length === 1
									? true
									: null
							}
							className={
								hasValueName === false && inputNameValue.length === 1
									? 'addListNextBtn disabled'
									: 'addListNextBtn'
							}
						>
							Next
						</button>
					</div>
					{/* list's cover */}
					<div className='addListImgBlock'>
						<div className='addListIcon' title='Add photo'>
							<img src={PF + 'icon/common/camera.svg'} alt='' />
						</div>
					</div>
					{/* list's name and desc */}
					<div className='addListForm'>
						<div
							className={
								activeInputName
									? 'addListInputBlock nameInput active'
									: 'addListInputBlock nameInput'
							}
							onClick={() => setActiveInputName(true)}
							onBlur={() => setActiveInputName(false)}
						>
							<span
								className='addListInputCounter'
								style={{ display: activeInputName ? 'inline' : 'none' }}
							>
								{hasValueName === false && inputNameValue.length === 1
									? 0
									: inputNameValue.length}{' '}
								/ 25
							</span>
							<label
								className={
									activeLabelBlueName
										? 'addListLabel activeBlue'
										: activeLabelGrayName
										? 'addListLabel active'
										: 'addListLabel'
								}
								htmlFor='nameInput'
							>
								Name
							</label>
							<input
								maxLength={25}
								id='nameInput'
								type='text'
								className='addListInput nameInput'
								onChange={e =>
									e.target.value
										? handleInputChange(e, 'name')
										: setHasValueName(false)
								}
							/>
						</div>
						<div
							className={
								activeInputDesc
									? 'addListInputBlock descInput active'
									: 'addListInputBlock descInput'
							}
							onClick={() => setActiveInputDesc(true)}
							onBlur={() => setActiveInputDesc(false)}
						>
							<span
								className='addListInputCounter'
								style={{ display: activeInputDesc ? 'inline' : 'none' }}
							>
								{hasValueDesc === false && inputDescValue.length === 1
									? 0
									: inputDescValue.length}{' '}
								/ 100
							</span>
							<label
								className={
									activeLabelBlueDesc
										? 'addListLabel activeBlue'
										: activeLabelGrayDesc
										? 'addListLabel active'
										: 'addListLabel'
								}
								htmlFor='descInput'
							>
								Description
							</label>
							<textarea
								maxLength={100}
								id='descInput'
								type='text'
								className='addListInput descInput'
								onChange={e =>
									e.target.value
										? handleInputChange(e, 'desc')
										: setHasValueDesc(false)
								}
							/>
						</div>
						<div className='addListRadioInputBlock'>
							<div className='addListRadioInputBlockTextBlock'>
								<span className='addListRadioInputBlockText'>Make private</span>
								<span className='addListRadioInputBlockAddition'>
									When you make a List private, only you can see it.
								</span>
							</div>
							<div className='checkboxBlock'>
								<input type='checkbox' />
							</div>
						</div>
					</div>
				</div>
				<div className='overlay' onClick={() => setActiveAddList(false)}></div>
			</form>
		</div>
	)
}

export default Profile
