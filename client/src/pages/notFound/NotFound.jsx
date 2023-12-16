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
import Layout from '../../components/layout/Layout'

const NotFound = ({ isLoading, setIsLoading }) => {
	// declaring states of modal windows

	const [activeTwitterBlue, setActiveTwitterBlue] = useState(false)
	const [activeLogOut, setActiveLogOut] = useState(false)
	const [activeLoginForm, setActiveLoginForm] = useState(false)
	const [activeVerified, setActiveVerified] = useState(false)

	document.title = 'Page not found / Twitter'

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
		!user && fetchUser()
	}, [user, userInStorage])

	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	return (
		<Layout
			isLoading={isLoading}
			setIsLoading={setIsLoading}
			user={user}
			userInStorage={userInStorage}
		>
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
				<Actual registered user={user} />
				<WhoToFollow user={user} />
			</div>
		</Layout>
	)
}

export default NotFound
