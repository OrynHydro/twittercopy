import { useEffect, useState } from 'react'
import { PostsLoader } from '../..'
import ListItem from '../listItem/ListItem'
import axios from 'axios'

export const ProfileListsMembership = ({ user }) => {
	document.title = `List membership for @${user?.userId}`

	const [memberLists, setMemberLists] = useState([])
	const [isLoadingLists, setIsLoadingLists] = useState(true)

	useEffect(() => {
		// setIsLoadingLists(true)
		const fetchUserMemberLists = async () => {
			await axios
				.get(`/lists/memberLists/${user?._id}`)
				.then(res => setMemberLists(res.data))
				.catch(() => setMemberLists(undefined))
			setIsLoadingLists(false)
		}
		memberLists?.length === 0 && fetchUserMemberLists()
	}, [memberLists?.length])

	return (
		<div className='profileListsMembership'>
			<div className='profileTop' style={{ display: 'block' }}>
				<h2 className='profileTopTitle'>Lists you’re on</h2>
				<span className='profileTopTweetsCounter'>{user?.userId}</span>
			</div>
			{memberLists === undefined ? (
				<div className='profileTopicsMain'>
					<h1 className='profileTopicsMainTitle'>
						You haven’t been added to any Lists yet
					</h1>
					<span className='profileTopicsText'>
						When someone adds you to a List, it’ll show up here.
					</span>
				</div>
			) : isLoadingLists ? (
				<PostsLoader />
			) : (
				<div style={{ marginTop: '53px' }}>
					{memberLists.map((list, index) => (
						<ListItem list={list} key={index} user={user} noPin />
					))}
				</div>
			)}
		</div>
	)
}
