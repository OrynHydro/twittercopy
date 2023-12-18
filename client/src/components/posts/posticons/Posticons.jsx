// importing css file, react hooks and axios library

import axios from 'axios'
import './posticons.css'
import { useEffect, useState } from 'react'
import Share from '../../share/Share'

const Posticons = ({
	icon,
	iconColoured,
	color,
	hoverColor,
	title,
	post,
	dbTitle,
	like,
	setLike,
	isLiked,
	setIsLiked,
	currentUser,
	setActiveModal,
}) => {
	// declaring state of icons

	const [activeIcon, setActiveIcon] = useState(false)

	const [isBookmarked, setIsBookmarked] = useState(false)

	useEffect(() => {
		setIsBookmarked(currentUser?.bookmarks.includes(post?._id))
	}, [post?._id, currentUser?.bookmarks])

	const [isRetweeted, setIsRetweeted] = useState(false)

	useEffect(() => {
		setIsRetweeted(currentUser?.retweets.includes(post?._id))
	}, [post?._id, currentUser?.retweets])

	const likePost = async () => {
		try {
			await axios.put(`/posts/${post?._id}/like`, {
				userId: currentUser?._id,
			})
			setLike(isLiked ? like - 1 : like + 1)
			setIsLiked(!isLiked)

			if (
				post.user._id !== currentUser._id &&
				!post.likes.includes(currentUser._id)
			) {
				const newNotification = await axios.post('/notifications', {
					receiver: post.user._id,
					sender: currentUser._id,
					type: 'like',
					post: post._id,
				})
				await axios.put(`/notifications/${post.user._id}/add`, {
					notificationId: newNotification.data._id,
				})
			}
		} catch (err) {
			console.log(err)
		}
	}

	const addBookmark = async () => {
		try {
			await axios
				.put(`/users/bookmarks/${currentUser?._id}`, {
					postId: post?._id,
				})
				.then(res =>
					setIsBookmarked(
						res.data === 'Added' ? true : res.data === 'Removed' && false
					)
				)
		} catch (error) {
			console.log(error)
		}
	}

	const retweetPost = async () => {
		try {
			await axios
				.put(`/posts/${post?._id}/retweet`, {
					userDbId: currentUser?._id,
				})
				.then(res =>
					setIsRetweeted(
						res.data === 'Retweeted'
							? true
							: res.data === 'Retweet removed' && false
					)
				)

			if (
				post.user._id !== currentUser._id &&
				!currentUser.retweets.includes(post._id)
			) {
				const newNotification = await axios.post('/notifications', {
					receiver: post.user._id,
					sender: currentUser._id,
					type: 'retweet',
					post: post._id,
				})
				await axios.put(`/notifications/${post.user._id}/add`, {
					notificationId: newNotification.data._id,
				})
			}
		} catch (error) {
			console.log(error)
		}
	}

	const iconClickHandler = () => {
		if (title === 'Like') {
			likePost()
		}
		if (title === 'Bookmark') {
			addBookmark()
		}
		if (title === 'Retweet') {
			retweetPost()
		}
		if (title === 'Reply') {
			setActiveModal(true)
		}
		return
	}

	return (
		<div
			className='homePostIconBlock'
			title={title}
			onMouseOver={() => setActiveIcon(true)}
			onMouseOut={() => setActiveIcon(false)}
			onClick={e => {
				e.preventDefault()
				iconClickHandler()
			}}
		>
			<div
				className='homePostIconImgBlock'
				style={{ backgroundColor: activeIcon ? hoverColor : null }}
			>
				<img
					src={
						(title === 'Like' && isLiked) ||
						(title === 'Bookmark' && isBookmarked) ||
						(title === 'Retweet' && isRetweeted) ||
						activeIcon
							? iconColoured
							: icon
					}
					alt=''
				/>
			</div>
			<span
				className='homePostIconCounter'
				style={{
					color:
						(title === 'Like' && isLiked) ||
						(title === 'Bookmark' && isBookmarked) ||
						(title === 'Retweet' && isRetweeted) ||
						activeIcon
							? color
							: '#84909a',
				}}
			>
				{dbTitle === 'likes'
					? like
					: dbTitle === 'replies'
					? post?.replies?.length
					: dbTitle === 'views'
					? post.views
					: dbTitle === 'shares' ||
					  dbTitle === 'bookmarks' ||
					  dbTitle === 'retweets'
					? ''
					: 0}
			</span>
		</div>
	)
}

export default Posticons
