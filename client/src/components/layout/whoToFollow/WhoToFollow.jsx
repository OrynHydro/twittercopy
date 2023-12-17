// import css, footer component and object of arrays

import './whoToFollow.css'

import { Footer } from './../../index'
import axios from 'axios'
import { useEffect, useState } from 'react'
import UserPopup from '../../user/userPopup/UserPopup'
import { Link } from 'react-router-dom'
import { UserFollowItem } from '../../user/userFollowItem/FollowItem'

const WhoToFollow = ({ maxWidth, user }) => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	const [isLoading, setIsLoading] = useState(false)

	const [recommended, setRecommended] = useState([])

	const findRecommended = async () => {
		try {
			setIsLoading(true)
			const res = await axios.get(`/users/${user._id}/recommendations`)
			setRecommended(res.data.slice(0, 3))
			setIsLoading(false)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		if (user) findRecommended()
	}, [user])

	const [activePopup, setActivePopup] = useState(false)

	const [modalText, setModalText] = useState('Follow')

	const followUser = async (e, item) => {
		e.preventDefault()
		if (user?.following.includes(item?._id)) {
			try {
				await axios.put(`/users/${item?._id}/unfollow`, {
					userId: user._id,
				})
				setModalText('Follow')
				user.following.splice(user.following.indexOf(item?._id), 1)
				item?.followers.splice(item?.followers.indexOf(item?._id), 1)
			} catch (err) {
				console.log(err)
			}
		} else if (!user?.following.includes(item?._id)) {
			try {
				await axios.put(`/users/${item?._id}/follow`, {
					userId: user._id,
				})
				setModalText('Following')
				user.following.push(item?._id)
				item?.followers.push(user._id)
			} catch (err) {
				console.log(err)
			}
		}
	}

	return (
		<div
			className='whoToFollow'
			style={{ maxWidth: maxWidth ? '340px' : '350px' }}
		>
			<div className='whoToFollowBlock'>
				<h1 className='whoToFollowTitle'>Who to follow</h1>
				{/* preset for different users */}
				{isLoading ? (
					<div className='loader'></div>
				) : recommended.length > 0 ? (
					<>
						{recommended.map((item, index) => (
							<UserFollowItem item={item} key={index} currentUser={user} />
						))}
						<Link className='showMoreBlock' to={'/connect_people'}>
							<span>Show more</span>
						</Link>
					</>
				) : (
					<div className='noUsers'>There are no users to follow</div>
				)}
			</div>
			<Footer />
		</div>
	)
}

export default WhoToFollow
