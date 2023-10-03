import { useContext, useEffect, useState } from 'react'
import './postPage.css'
import { BiMessageRoundedDetail } from 'react-icons/bi'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Posts, PostsLoader, Share } from '../../../../components'
import { UserContext } from '../../../../context/UserContext'
import { useLocalStorage } from '../../../../utils/useLocalStorage'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const PostPage = ({
	unfollow,
	setUnfollow,
	activeFollowBtn,
	setActiveFollowBtn,
}) => {
	const [post, setPost] = useState(null)
	const [postReplies, setPostReplies] = useState([])

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
		fetchUser()
	}, [userInStorage])

	const findPost = async () => {
		await axios.get(`/posts/${params.postId}`).then(res => setPost(res.data))
	}

	const findReplies = () => {
		post?.replies.map(async replyId => {
			await axios
				.get(`/posts/${replyId}`)
				.then(res => setPostReplies(prev => [...prev, res.data]))
		})
	}

	useEffect(() => {
		if (!post) findPost()
	}, [post])

	useEffect(() => {
		if (post?.replies.length !== 0 && postReplies.length === 0) findReplies()
	}, [post?.replies.length, postReplies.length])

	return (
		<div className='postPage'>
			{post ? (
				<>
					<h2 className='profileTopTitle'>Post</h2>
					<div className='postPageSeeMore'>
						<BiMessageRoundedDetail />
						<span className='postPageSeeMoreText'>
							<a>{user.username}</a> · <a>See more</a>
						</span>
					</div>
					<Posts
						post={[post, post.user]}
						more={PF + 'icon/utility/moreHorizontal.svg'}
						moreActive={PF + 'icon/utility/moreHorizontalActive.svg'}
						currentUser={user}
						isUserPosts={post.user._id === user._id ? true : false}
						activeFollowBtn={activeFollowBtn}
						setActiveFollowBtn={setActiveFollowBtn}
						unfollow={unfollow}
						setUnfollow={setUnfollow}
						postPage
					/>
					<Share user={user} postPage originalPost={post?._id} />
					{postReplies.length !== 0
						? postReplies.map(reply => (
								<Posts
									post={[reply, reply.user]}
									more={PF + 'icon/utility/moreHorizontal.svg'}
									moreActive={PF + 'icon/utility/moreHorizontalActive.svg'}
									currentUser={user}
									isUserPosts={reply.user._id === user._id ? true : false}
									activeFollowBtn={activeFollowBtn}
									setActiveFollowBtn={setActiveFollowBtn}
									unfollow={unfollow}
									setUnfollow={setUnfollow}
								/>
						  ))
						: post?.replies.length !== 0 &&
						  post?.replies.map(() => (
								<div style={{ margin: '8px 12px' }}>
									<Skeleton height={16} />
									<Skeleton height={64} />
								</div>
						  ))}
				</>
			) : (
				<PostsLoader />
			)}
		</div>
	)
}

export default PostPage
