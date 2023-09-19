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
} from 'react-router-dom'

import { Posts } from './../../../components/index'

import { useOutsideClick } from '../../../utils/useOutsideClick'

import { UserContext } from '../../../context/UserContext'
import { useLocalStorage } from '../../../utils/useLocalStorage'
import axios from 'axios'
import moment from 'moment'

const FollowingItem = ({
	username,
	userId,
	userDbId,
	profilePicture,
	bio,
	followers,
	following,
	currentUser,
}) => {
	// declaring variable that helps to get images from folder directly without importing

	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	const [text, setText] = useState(
		!currentUser?.following.includes(userId) ? 'Following' : 'Follow'
	)
	const [openModal, setOpenModal] = useState(false)
	const [modalText, setModalText] = useState(
		!currentUser?.following.includes(userId) ? 'Following' : 'Follow'
	)

	const followUser = async () => {
		if (currentUser?.following.includes(userDbId)) {
			try {
				await axios.put(`/users/${userDbId}/unfollow`, {
					userId: currentUser._id,
				})
				setModalText('Follow')
				setText('Follow')
				currentUser.following = currentUser.following.filter(
					item => item !== userDbId
				)
				followers = followers.filter(item => item !== currentUser._id)
			} catch (err) {
				console.log(err)
			}
		} else if (!currentUser?.following.includes(userDbId)) {
			try {
				await axios.put(`/users/${userDbId}/follow`, {
					userId: currentUser._id,
				})
				setModalText('Following')
				setText('Following')
				currentUser.following.push(userDbId)
				followers.push(currentUser._id)
			} catch (err) {
				console.log(err)
			}
		}
	}

	return (
		<div className='followingBlockItem'>
			<div
				className='followingBlockItemLeft'
				onMouseOver={() => setOpenModal(true)}
				onMouseOut={() => setOpenModal(false)}
			>
				<div className='followingBlockItemUserAvaBlock'>
					<img
						className='followingBlockItemUserAva'
						src={
							profilePicture
								? PF + 'storage/' + profilePicture
								: PF + 'icon/noAvatar.png'
						}
						alt=''
					/>
					<div className='overlay'></div>
				</div>

				<div className='followingBlockUserData'>
					<h2 className='followingBlockUsername'>{username}</h2>
					<p className='followingBlockUserId'>
						{userId + ' '}
						{currentUser.followers.includes(userDbId) && (
							<span className='followsYou'>Follows you</span>
						)}
					</p>
					<p className='followingBlockBio'>{bio}</p>
				</div>
				<div
					className='followingBlockModal'
					style={{ display: openModal ? 'block' : 'none' }}
				>
					<div className='followingBlockModalTop'>
						<div className='followingBlockUserAvaBlock'>
							<img
								src={
									profilePicture
										? PF + 'storage/' + profilePicture
										: PF + 'icon/noAvatar.png'
								}
								alt=''
							/>
							<div className='overlay'></div>
						</div>
						<div
							className={
								modalText === 'Unfollow'
									? 'followingBlockRight unfollowBtn'
									: modalText === 'Follow'
									? 'followingBlockRight followBtn'
									: 'followingBlockRight'
							}
							onMouseOver={() => {
								modalText !== 'Follow' && setModalText('Unfollow')
							}}
							onMouseOut={() => {
								modalText !== 'Follow' && setModalText('Following')
							}}
						>
							<button onClick={() => followUser(true)}>{modalText}</button>
						</div>
					</div>
					<div className='followingBlockModalUserData'>
						<h2>{username}</h2>
						<p>{userId}</p>
					</div>
					<div className='followingBlockModalFollow'>
						<span className='followingBlockModalFollowItem'>
							<strong>{following.length}</strong> Following
						</span>
						<span className='followingBlockModalFollowItem'>
							<strong>{followers.length}</strong> Followers
						</span>
					</div>
					{/* <div>
				{currentUser?.following
				.filter(item => followers.find(i => i === item))
				.map(shared => (
					<>{shared}</>
				))}
			</div> */}
				</div>
			</div>
			<div
				className={
					text === 'Unfollow'
						? 'followingBlockRight unfollowBtn'
						: text === 'Follow'
						? 'followingBlockRight followUserBtn'
						: 'followingBlockRight'
				}
				onMouseOver={() => {
					text !== 'Follow' && setText('Unfollow')
				}}
				onMouseOut={() => {
					text !== 'Follow' && setText('Following')
				}}
			>
				<button onClick={() => followUser(false)}>{text}</button>
			</div>
		</div>
	)
}

const Profile = ({ isLoading, setIsLoading }) => {
	// declaring states of modal windows

	const [activeTwitterBlue, setActiveTwitterBlue] = useState(false)
	const [activeLogOut, setActiveLogOut] = useState(false)
	const [activeLoginForm, setActiveLoginForm] = useState(false)
	const [activeVerified, setActiveVerified] = useState(false)
	const [activeLists, setActiveLists] = useState(false)
	const listsBlock = useOutsideClick(() => setActiveLists(false))
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

	// followers and followings pages inside of profile

	const ProfileFollowers = () => {
		document.title = `People followed ${user?.username}`

		const [userFollowers, setUserFollowers] = useState([])

		const findUserFollowers = async () => {
			try {
				await axios
					.get(`/users/followers/${user?._id}`)
					.then(res => setUserFollowers(res.data))
			} catch (err) {
				console.log(err)
			}
		}

		user && userFollowers.length === 0 && findUserFollowers()

		return (
			<div className='profileFollow'>
				<div className='profileSwitchBlock'>
					<div className='profileSwitchItem active'>Followers</div>
					<div className='profileSwitchItem'>
						<Link to={`/${user?.userId}/following`}>Following</Link>
					</div>
				</div>
				<div className='followingBlock'>
					{userFollowers.length !== 0 ? (
						userFollowers.map((follower, id) => (
							<FollowingItem
								username={follower.username}
								userId={follower.userId}
								userDbId={follower._id}
								profilePicture={follower.profilePicture}
								key={id}
								bio={follower.bio}
								followers={follower.followers}
								following={follower.following}
								currentUser={user}
							/>
						))
					) : (
						<PostsLoader />
					)}
				</div>
			</div>
		)
	}

	const ProfileFollowing = () => {
		document.title = `People following ${user?.username}`

		const [userFollowing, setUserFollowing] = useState([])

		const findUserFollowing = async () => {
			try {
				await axios
					.get(`/users/followings/${user?._id}`)
					.then(res => setUserFollowing(res.data))
			} catch (err) {
				console.log(err)
			}
		}

		user && userFollowing.length === 0 && findUserFollowing()

		return (
			<div className='profileFollow'>
				<div className='profileSwitchBlock'>
					<div className='profileSwitchItem'>
						<Link to={`/${user?.userId}/followers`}>Followers</Link>
					</div>
					<div className='profileSwitchItem active'>Following</div>
				</div>
				<div className='followingBlock'>
					{userFollowing.length !== 0 ? (
						userFollowing.map((following, id) => (
							<FollowingItem
								username={following.username}
								userId={following.userId}
								userDbId={following._id}
								profilePicture={following.profilePicture}
								key={id}
								bio={following.bio}
								followers={following.followers}
								following={following.following}
								currentUser={user}
							/>
						))
					) : (
						<PostsLoader />
					)}
				</div>
			</div>
		)
	}

	// topics pages inside of profile

	const ProfileTopics = () => {
		document.title = 'Topics / Twitter'
		return (
			<div className='profileTopics'>
				<div className='profileTopicsTop'>
					<h1 className='profileTopicsTitle'>Topics</h1>
					<div className='profileTopicsSwitch'>
						<div className='profileTopicsSwitchItem active'>Followed</div>
						<div className='profileTopicsSwitchItem'>
							<Link to={`/${user?.userId}/topics/not_interested`}>
								Not Interested
							</Link>
						</div>
					</div>
				</div>
				<div className='profileTopicsContentBlock'>
					<span className='profileTopicsText'>
						The Topics you follow are used to personalize the Tweets, events,
						and ads that you see, and show up publicly on your profile
					</span>
				</div>
				<hr className='settingsHr' />
				<div className='profileTopicsContentBlock'>
					<span className='profileTopicsText'>
						Topics that you follow are shown here. To see all the things that
						Twitter thinks you’re interested in, check out{' '}
						<Link>Your Twitter data.</Link> You can also <Link>learn more</Link>{' '}
						about following Topics.
					</span>
				</div>
			</div>
		)
	}

	const ProfileTopicsNotInterested = () => {
		document.title = 'Topics / Twitter'
		return (
			<div className='profileTopics'>
				<div className='profileTopicsTop'>
					<h1 className='profileTopicsTitle'>Topics</h1>
					<div className='profileTopicsSwitch'>
						<div className='profileTopicsSwitchItem'>
							<Link to={`/${user?.userId}/topics/followed`}>Followed</Link>
						</div>
						<div className='profileTopicsSwitchItem active'>Not Interested</div>
					</div>
				</div>
				<div className='profileTopicsMain'>
					<h1 className='profileTopicsMainTitle'>No interest? No problem.</h1>
					<span className='profileTopicsText'>
						When you tell us you're not interested in a Topic, it will show up
						here. We won't recommend Tweets, events, or ads related to Topics
						you aren't into.
					</span>
				</div>
			</div>
		)
	}

	// lists pages inside of profile

	const ProfileLists = () => {
		document.title = `Lists created by @${user?.userId}`
		return (
			<div className='profileLists'>
				<div className='profileTop'>
					<div className='profileTopTextBlock'>
						<h2 className='profileTopTitle'>Lists</h2>
						<span className='profileTopTweetsCounter'>{user?.userId}</span>
					</div>
					<div className='profileTopIconBlock'>
						<div
							className='profileTopIcon'
							onClick={() => setActiveAddList(true)}
						>
							<img src={PF + 'icon/sidebarMore/lists.svg'} alt='' />
						</div>
						<div
							className='profileTopIcon'
							onClick={() => setActiveLists(true)}
						>
							<img src={PF + 'icon/utility/moreHorizontal.svg'} alt='' />
						</div>
						<div
							ref={listsBlock}
							className={activeLists ? 'listsBlock active' : 'listsBlock'}
						>
							<Link
								to={`/${user?.userId}/lists/membership`}
								onClick={() => setActiveLists(false)}
							>
								<img src={PF + 'icon/sidebarMore/lists.svg'} alt='' />
								Lists you’re on
							</Link>
						</div>
					</div>
				</div>
				<div className='profileListsMain'>
					<div className='profileListsTextContainer'>
						<h1 className='profileListsTitle'>Pinned Lists</h1>
						<p className='profileListsText'>
							Nothing to see here yet — pin your favorite Lists to access them
							quickly.
						</p>
					</div>
					<hr className='settingsHr' />
					<div className='profileListsTextContainer'>
						<h1 className='profileListsTitle'>Your Lists</h1>
						<p className='profileListsText'>
							You haven't created or followed any Lists. When you do, they'll
							show up here.
						</p>
					</div>
				</div>
			</div>
		)
	}

	const ProfileListsMembership = () => {
		document.title = `List membership for @${user?.userId}`
		return (
			<div className='profileListsMembership'>
				<div className='profileTop'>
					<h2 className='profileTopTitle'>Lists you’re on</h2>
					<span className='profileTopTweetsCounter'>{user?.userId}</span>
				</div>
				<div className='profileTopicsMain'>
					<h1 className='profileTopicsMainTitle'>
						You haven’t been added to any Lists yet
					</h1>
					<span className='profileTopicsText'>
						When someone adds you to a List, it’ll show up here.
					</span>
				</div>
			</div>
		)
	}

	// user data states

	const { user, setUser } = useContext(UserContext)
	const [userInStorage, setUserInStorage] = useLocalStorage('user')

	// fetches user from local storage

	useEffect(() => {
		const fetchUser = async () => {
			const findUser = await axios.get(`/users/findByToken/${userInStorage}`)
			setUser(findUser.data)
		}
		fetchUser()
	}, [userInStorage])

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
		? (document.title = `${user?.username} (${user?.userId})`)
		: (document.title = 'Profile / Twitter')

	// fetches user's posts from database

	const [userPosts, setUserPosts] = useState([])

	const findUserPosts = async () => {
		setActivePosts('tweets')
		setUserPosts([])
		try {
			const userAllPosts = await axios.get(
				`/posts/allUserPosts/${user?.userId.split('@')[1]}`
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
		user?.userId && findUserPosts()
	}, [user?.userId])

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
		setCurrentCover(user?.coverPicture)

	// fetches posts liked by user

	const [activePosts, setActivePosts] = useState('tweets')

	const [likedPosts, setLikedPosts] = useState([])

	const findLikedPosts = async () => {
		setActivePosts('likes')
		setLikedPosts([])
		const getUserLikedPosts = async () => {
			const userLikedPosts = await axios.get(
				`/users/userLikedPosts/${user?._id}`
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
								location.pathname === `/${user?.userId}/topics` ||
								location.pathname === `/${user?.userId}/lists` ||
								location.pathname === `/${user?.userId}/topics/followed` ||
								location.pathname === `/${user?.userId}/topics/not_interested`
									? 'none'
									: 'block',
						}}
					>
						<h2 className='profileTopTitle'>{user?.username}</h2>
						<span className='profileTopTweetsCounter'>
							{userPosts.length} Tweets
						</span>
					</div>
					{/* routes to different pages inside profile */}
					<Routes>
						<Route path='/followers' element={<ProfileFollowers />} />
						<Route path='/following' element={<ProfileFollowing />} />
						<Route path='/topics' element={<ProfileTopics />} />
						<Route path='/topics/followed' element={<ProfileTopics />} />
						<Route
							path='/topics/not_interested'
							element={<ProfileTopicsNotInterested />}
						/>
						<Route path='/lists' element={<ProfileLists />} />
						<Route
							path='/lists/membership'
							element={<ProfileListsMembership />}
						/>
					</Routes>
					{/* main content in page */}
					<div
						className='profileMainBlock'
						style={{
							display:
								location.pathname === `/${user?.userId}/following` ||
								location.pathname === `/${user?.userId}/followers` ||
								location.pathname === `/${user?.userId}/topics` ||
								location.pathname === `/${user?.userId}/lists` ||
								location.pathname === `/${user?.userId}/lists/membership` ||
								location.pathname === `/${user?.userId}/topics/followed` ||
								location.pathname === `/${user?.userId}/topics/not_interested`
									? 'none'
									: 'block',
						}}
					>
						{/* displays user cover and avatar */}
						<div className='profilebackgroundBlock'>
							<img
								className='profileBackground'
								src={PF + 'storage/' + user?.coverPicture}
								alt=''
								onClick={() => openUserCoverFullScreen(true)}
							/>
							<div
								className='profileUserAva'
								onClick={() => {
									user?.profilePicture && openUserAvaFullScreen(true)
								}}
							>
								<img
									src={
										user && user?.profilePicture
											? PF + 'storage/' + user?.profilePicture
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
									src={PF + 'storage/' + user?.coverPicture}
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
									src={PF + 'storage/' + user?.profilePicture}
									ref={userAvatar}
								/>
								<div className='userAvaFullScreenOverlay'></div>
							</div>
						)}
						{/* user's name, id, bio, location, website, followings and followers */}
						<div className='profileUserInfo'>
							<button
								className='editProfile'
								onClick={() => setActiveEditProfileBlock(true)}
							>
								Edit profile
							</button>
							<h1 className='profileUsername'>{user?.username}</h1>
							<p className='profileUserId'>{user?.userId}</p>
							<p className='profileBio'>{user?.bio}</p>
							<div className='profileLocationAndJoined'>
								{user?.location && (
									<span className='profileUserJoined'>
										<img src={PF + 'icon/colored/gpsGray.svg'} alt='' />
										{user?.location}
									</span>
								)}
								{user?.website && (
									<span className='profileUserJoined'>
										<img
											src={PF + 'icon/common/link.svg'}
											alt=''
											style={{ transform: 'rotate(-45deg)' }}
										/>
										<a href={user?.website} target='_blank'>
											{user?.website}
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
								<Link to={`/${user?.userId}/following`}>
									<span>
										<strong>{user?.following.length}</strong> Following
									</span>
								</Link>
								<Link to={`/${user?.userId}/followers`}>
									<span>
										<strong>{user?.followers.length}</strong> Followers
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
							location.pathname === `/${user?.userId}/lists`
								? 'none'
								: 'block',
					}}
				>
					{activePosts === 'tweets' && userPosts?.length !== 0 ? (
						userPosts.map((post, index) => (
							<Posts
								key={index}
								post={[post, user]}
								more={PF + 'icon/utility/moreHorizontal.svg'}
								moreActive={PF + 'icon/utility/moreHorizontalActive.svg'}
								currentUser={user}
								isUserPosts
							/>
						))
					) : activePosts === 'likes' && likedPosts?.length !== 0 ? (
						likedPosts?.map((post, index) => (
							<Posts
								key={index}
								post={[post, post.user]}
								more={PF + 'icon/utility/moreHorizontal.svg'}
								moreActive={PF + 'icon/utility/moreHorizontalActive.svg'}
								currentUser={user}
								isUserPosts={post.user._id === user._id ? true : false}
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
