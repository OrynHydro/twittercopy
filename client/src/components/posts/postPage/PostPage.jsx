import { useContext, useEffect, useState } from 'react'
import './postPage.css'
import { BiMessageRoundedDetail } from 'react-icons/bi'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Posts, PostsLoader, Share } from '../../index'
import { UserContext } from '../../../context/UserContext'
import { useLocalStorage } from '../../../utils/useLocalStorage'
import 'react-loading-skeleton/dist/skeleton.css'

const PostPage = ({
	unfollow,
	setUnfollow,
	activeFollowBtn,
	setActiveFollowBtn,
}) => {
	const [post, setPost] = useState(null)

	const params = useParams()

	const PF = process.env.REACT_APP_PUBLIC_FOLDER

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

	const findPost = async () => {
		await axios
			.get(`/posts/replies/${params.postId}`)
			.then(res => setPost(res.data))
	}

	useEffect(() => {
		if (!post) findPost()
	}, [post])

	useEffect(() => {
		if (params.postId !== post?._id && post) {
			findPost()
		}
	}, [params.postId])

	return (
		<div className='postPage'>
			{post && post?._id === params.postId ? (
				<>
					<h2 className='profileTopTitle'>Post</h2>
					<div className='postPageSeeMore'>
						<BiMessageRoundedDetail />
						<span className='postPageSeeMoreText'>
							<a>{post.user.username}</a> · <a>See more</a>
						</span>
					</div>
					<Posts
						post={post}
						more={PF + 'icon/utility/moreHorizontal.svg'}
						moreActive={PF + 'icon/utility/moreHorizontalActive.svg'}
						currentUser={user}
						isUserPosts={post.user?._id === user?._id ? true : false}
						activeFollowBtn={activeFollowBtn}
						setActiveFollowBtn={setActiveFollowBtn}
						unfollow={unfollow}
						setUnfollow={setUnfollow}
						postPage
					/>
					<Share user={user} postPage originalPost={post} />
					{post?.replies.length !== 0 &&
						post?.replies.map((reply, index) => (
							<Posts
								key={index}
								post={reply}
								more={PF + 'icon/utility/moreHorizontal.svg'}
								moreActive={PF + 'icon/utility/moreHorizontalActive.svg'}
								currentUser={user}
								isUserPosts={reply.user?._id === user?._id ? true : false}
								activeFollowBtn={activeFollowBtn}
								setActiveFollowBtn={setActiveFollowBtn}
								unfollow={unfollow}
								setUnfollow={setUnfollow}
							/>
						))}
				</>
			) : (
				<PostsLoader />
			)}
		</div>
	)
}

export default PostPage
