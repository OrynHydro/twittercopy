import './notFound.css'

import {
	Sidebar,
	Actual,
	WhoToFollow,
	TwitterBlue,
	LogoutForm,
	LoginForm,
	VerifiedOrganizations,
	TwitterCircle,
	TwitterProfessionals,
} from '../../components/index'
import { useContext, useEffect, useState } from 'react'
import { useScrollPosition } from '../../utils/useScrollPosition'
import { UserContext } from '../../context/UserContext'
import { useLocalStorage } from '../../utils/useLocalStorage'
import axios from 'axios'
import { Link } from 'react-router-dom'

const NotFound = ({ isLoading, setIsLoading }) => {
	// declaring states of modal windows

	const [scrollPosition, isScrollingUp] = useScrollPosition()
	const [activeTwitterBlue, setActiveTwitterBlue] = useState(false)
	const [activeLogOut, setActiveLogOut] = useState(false)
	const [activeLoginForm, setActiveLoginForm] = useState(false)
	const [activeVerified, setActiveVerified] = useState(false)
	const [activeProfessionals, setActiveProfessionals] = useState(false)

	const [activeEdit, setActiveEdit] = useState(false)
	const [activeEditCircle, setActiveEditCircle] = useState(true)
	const [activeEditRec, setActiveEditRec] = useState(false)
	const [activeEditInput, setActiveEditInput] = useState(false)
	const [hasValue, setHasValue] = useState(false)

	document.title = 'Bookmarks / Twitter'

	// removes scrollbar when modal windows are open

	activeLogOut || activeLoginForm || activeTwitterBlue || activeVerified
		? (document.body.style.overflowY = 'hidden')
		: (document.body.style.overflowY = 'inherit')

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

	const PF = process.env.REACT_APP_PUBLIC_FOLDER

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
			{/* main content in page */}
			<div className='notFound'>
				<div className='not-found-container'>
					<div className='not-found-content'>
						<img src={PF + 'logo/logo.png'} alt='' />
						<h1 className='not-found-heading'>Page not found</h1>
						<p className='not-found-text'>
							Sorry, this page does not exist. Please return to the main page.
						</p>
						<Link to={'/'} className='not-found-button'>
							Back to Home
						</Link>
					</div>
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
		</div>
	)
}

export default NotFound
