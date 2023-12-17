import './connect.css'
import { useContext, useEffect, useState } from 'react'
import { Actual, Footer, Layout, PostsLoader } from '../../../components'
import { UserContext } from '../../../context/UserContext'
import { useLocalStorage } from '../../../utils/useLocalStorage'
import axios from 'axios'
import { UserFollowItem } from '../../../components/user/userFollowItem/FollowItem'

const Connect = ({ isLoading, setIsLoading }) => {
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

	const [recommended, setRecommended] = useState([])

	const findRecommended = async () => {
		try {
			setIsLoading(true)
			const res = await axios.get(`/users/${user._id}/recommendations`)
			setRecommended(res.data)
			setIsLoading(false)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		if (user) findRecommended()
	}, [user])

	return (
		<Layout
			isLoading={isLoading}
			setIsLoading={setIsLoading}
			user={user}
			userInStorage={userInStorage}
		>
			<div className='connect'>
				<div className='notificationsTopbar'>
					<h1 className='notificationsTopbarTitle'>Connect</h1>
				</div>
				<div className='connectMain'>
					<h1 className='connectTitle'>Suggested for you</h1>
					{isLoading ? (
						<PostsLoader />
					) : (
						recommended.map((item, index) => (
							<UserFollowItem item={item} key={index} currentUser={user} />
						))
					)}
				</div>
			</div>
			{/* rightbar with trends */}
			<div>
				<Actual registered user={user} />
				<div className='connectFooter'>
					<Footer />
				</div>
			</div>
		</Layout>
	)
}

export default Connect
