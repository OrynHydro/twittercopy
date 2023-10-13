// importing css file, components, custom and react hooks, user context and axios library

import './listPage.css'

import {
	Actual,
	Posts,
	PostsLoader,
	WhoToFollow,
} from '../../../components/index'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../../context/UserContext'
import { useLocalStorage } from '../../../utils/useLocalStorage'
import axios from 'axios'
import Layout from '../../../components/layout/Layout'
import { Link, useParams } from 'react-router-dom'

const ListPage = ({ isLoading, setIsLoading }) => {
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

	const params = useParams()

	const [list, setList] = useState(null)

	useEffect(() => {
		const fetchList = async () => {
			await axios
				.get(`/lists/findList/${params.listId}`)
				.then(res => setList(res.data))
		}
		!list && fetchList()
	}, [list])

	document.title = list
		? `${user?.userId}/${list?.name} / Twitter`
		: `List / Twitter`

	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	const [membersPosts, setMembersPosts] = useState([])

	useEffect(() => {
		const fetchMembersPosts = async () => {
			await axios
				.get(`/lists/membersPosts/${params.listId}`)
				.then(res => setMembersPosts(res.data[0].membersPosts))
		}
		membersPosts.length === 0 &&
			list?.members.length !== 0 &&
			fetchMembersPosts()
	}, [membersPosts.length, list?.members.length])

	// Post

	const [activeFollowBtn, setActiveFollowBtn] = useState('Following')

	const [unfollow, setUnfollow] = useState(false)

	return (
		<Layout
			isLoading={isLoading}
			setIsLoading={setIsLoading}
			user={user}
			userInStorage={userInStorage}
		>
			<div className='bookmarks'>
				<div className='profileTop listTopItem'>
					<div className='profileTopTextBlock'>
						<h2 className='profileTopTitle'>{list?.name || 'List'}</h2>
						<span className='profileTopTweetsCounter'>{user?.userId}</span>
					</div>
					<div className='profileTopIconBlock'>
						<div className='profileTopIcon'>
							<img src={PF + 'icon/common/share.svg'} alt='' />
						</div>
						<div className='profileTopIcon'>
							<img src={PF + 'icon/utility/moreHorizontal.svg'} alt='' />
						</div>
					</div>
				</div>
				<img
					src={
						list?.coverPicture === 'defaultListCover.png' || !list?.coverPicture
							? PF + 'defaultListCover.png'
							: PF + 'storage/' + list?.coverPicture
					}
					style={{ marginTop: '53px' }}
				/>
				<div className='listPageData'>
					<h2 className='listPageName'>{list?.name || 'List'}</h2>
					<Link
						className='listItemInfoBottom listPageUser'
						to={`/${user?.userId}`}
					>
						<img
							src={PF + 'storage/' + user?.profilePicture}
							alt=''
							className='listItemInfoBottomCreatorAvatar'
						/>
						<p className='listItemInfoBottomUsername'>{user?.username}</p>
						<span className='listItemInfoBottomUserId'>{user?.userId}</span>
					</Link>
					<div className='listPageMembersAndFollowers'>
						<span>
							<strong>{list?.members.length || 0}</strong>
							{list?.members.length === 0 || list?.members.length > 1
								? ' Members'
								: ' Member'}
						</span>
						<span>
							<strong>{list?.followers.length || 0}</strong>
							{list?.followers.length === 0 || list?.followers.length > 1
								? ' Followers'
								: ' Follower'}
						</span>
					</div>
					<button className='editProfileButtons following'>Edit List</button>
				</div>
				<hr className='postPageHr listPageHr' />
				{membersPosts.length === 0 && list?.members !== 0 ? (
					<PostsLoader />
				) : membersPosts.length > 0 ? (
					membersPosts.map((post, index) => (
						<Posts
							key={index}
							post={post}
							more={PF + 'icon/utility/moreHorizontal.svg'}
							moreActive={PF + 'icon/utility/moreHorizontalActive.svg'}
							currentUser={user}
							isUserPosts={post.user?._id === user?._id ? true : false}
							activeFollowBtn={activeFollowBtn}
							setActiveFollowBtn={setActiveFollowBtn}
							unfollow={unfollow}
							setUnfollow={setUnfollow}
							listPage
						/>
					))
				) : (
					<>
						Waiting for posts Posts from people in this List will show up here.
					</>
				)}
			</div>
			{/* rightbar with trends */}
			<div>
				<Actual registered />
				<WhoToFollow />
			</div>
		</Layout>
	)
}

export default ListPage
