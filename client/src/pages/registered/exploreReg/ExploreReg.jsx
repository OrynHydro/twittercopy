// importing css file, components, custom and react hooks, user context and axios library

import './exploreReg.css'

import { Actual, WhoToFollow, Layout } from '../../../components/index'
import { useContext, useEffect } from 'react'
import { UserContext } from '../../../context/UserContext'
import { useLocalStorage } from '../../../utils/useLocalStorage'
import axios from 'axios'

const ExploreReg = ({ isLoading, setIsLoading }) => {
	document.title = 'Explore / Twitter'

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
			<Actual user={user} />
			<WhoToFollow maxWidth />
		</Layout>
	)
}

export default ExploreReg
