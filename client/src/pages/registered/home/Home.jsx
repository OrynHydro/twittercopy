// importing css file, components, custom and react hooks, user context and axios library

import './home.css'

import {
	Sidebar,
	Actual,
	WhoToFollow,
	Share,
	TwitterBlue,
	LogoutForm,
	LoginForm,
	VerifiedOrganizations,
	TwitterProfessionals,
	Loading,
	PostsLoader,
} from '../../../components/index'
import { useState, useEffect, useContext } from 'react'
import { useScrollPosition } from '../../../utils/useScrollPosition'

import { Posts } from './../../../components/index'
import { UserContext } from '../../../context/UserContext'
import { useLocalStorage } from '../../../utils/useLocalStorage'
import axios from 'axios'

const Home = ({ isLoading, setIsLoading }) => {
	// declaring variable that helps to get images from folder directly without importing

	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	// declaring switch menu states

	const [activeForYou, setActiveForYou] = useState(true)
	const [activeFollowing, setActiveFollowing] = useState(false)

	// declaring states of modal windows

	const [activeTwitterBlue, setActiveTwitterBlue] = useState(false)
	const [activeLogOut, setActiveLogOut] = useState(false)
	const [activeLoginForm, setActiveLoginForm] = useState(false)
	const [activeVerified, setActiveVerified] = useState(false)
	const [activeProfessionals, setActiveProfessionals] = useState(false)

	// declaring states of custom input field

	const [activeEdit, setActiveEdit] = useState(false)
	const [activeEditCircle, setActiveEditCircle] = useState(true)
	const [activeEditRec, setActiveEditRec] = useState(false)
	const [activeEditInput, setActiveEditInput] = useState(false)
	const [hasValue, setHasValue] = useState(false)

	document.title = 'Home / Twitter'

	// removes scrollbar when modal windows are open

	activeLogOut ||
	activeLoginForm ||
	activeTwitterBlue ||
	activeVerified ||
	activeProfessionals ||
	activeEdit
		? (document.body.style.overflowY = 'hidden')
		: (document.body.style.overflowY = 'inherit')

	// user data states

	const { user, setUser } = useContext(UserContext)
	const [userInStorage, setUserInStorage] = useLocalStorage('user')

	// state of timeline and its loading

	const [userPosts, setUserPosts] = useState([])
	const [loadingPosts, setLoadingPosts] = useState(true)

	// fetches user from local storage

	useEffect(() => {
		const fetchUser = async () => {
			const findUser = await axios.get(`/users/findByToken/${userInStorage}`)
			setUser(findUser.data)
		}
		fetchUser()
	}, [userInStorage])

	// fetches timeline from database

	useEffect(() => {
		const getTimeline = async () => {
			try {
				if (!user) return
				const timeline = await axios.get(
					`/posts/timeline/${user?.userId.split('@')[1]}`
				)
				setUserPosts(timeline.data)
				setLoadingPosts(false)
			} catch (err) {
				console.log(err)
			}
		}
		getTimeline()
	}, [user?.userId])

	return (
		<div style={{ display: 'flex', position: 'relative' }}>
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

			{/* main content in page */}

			<div className='home'>
				<div className='homeTopbar'>
					<h1 className='homeTopbarTitle'>Home</h1>
					<div className='homeTopbarBlock'>
						<div
							className={
								activeForYou ? 'homeTopbarItem active' : 'homeTopbarItem'
							}
							onClick={() => {
								setActiveFollowing(false)
								setActiveForYou(true)
							}}
						>
							For you
						</div>
						<div
							className={
								activeFollowing ? 'homeTopbarItem active' : 'homeTopbarItem'
							}
							onClick={() => {
								setActiveFollowing(true)
								setActiveForYou(false)
							}}
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
					) : (
						userPosts.map(
							(post, index) => (
								<Posts
									key={index}
									post={post}
									more={PF + 'icon/utility/moreHorizontal.svg'}
									moreActive={PF + 'icon/utility/moreHorizontalActive.svg'}
									currentUser={user}
								/>
							)

							// ) : (
							// 	post[0].map((multiplePosts, multipleIndex) => (
							// 		<Posts
							// 			key={multipleIndex}
							// 			post={[multiplePosts, post[1]]}
							// 			more={PF + 'icon/utility/moreHorizontal.svg'}
							// 			moreActive={PF + 'icon/utility/moreHorizontalActive.svg'}
							// 			currentUser={user}
							// 		/>
							// 	))
							// )
						)
					)}
				</div>
			</div>
			{/* rightbar with trends  */}
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
			<TwitterProfessionals
				active={activeProfessionals}
				setActive={setActiveProfessionals}
			/>
		</div>
	)
}

export default Home
