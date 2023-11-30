// importing css file, react hooks and axios library

import axios from 'axios'
import './posticons.css'
import { useEffect, useState } from 'react'

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
}) => {
	// declaring state of icons

	const [activeIcon, setActiveIcon] = useState(false)

	const [isBookmarked, setIsBookmarked] = useState(false)

	useEffect(() => {
		setIsBookmarked(currentUser?.bookmarks.includes(post?._id))
	}, [post?._id, currentUser?.bookmarks])

	const likePost = async () => {
		try {
			await axios.put(`/posts/${post?._id}/like`, {
				userId: currentUser?._id,
			})
			setLike(isLiked ? like - 1 : like + 1)
			setIsLiked(!isLiked)
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

	const iconClickHandler = () => {
		if (title === 'Like') {
			likePost()
		}
		if (title === 'Bookmark') {
			addBookmark()
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
						activeIcon
							? color
							: '#84909a',
				}}
			>
				{dbTitle === 'likes'
					? like
					: dbTitle === 'replies'
					? post?.replies?.length
					: dbTitle === 'retweets'
					? post?.retweets?.length
					: dbTitle === 'views'
					? post.views
					: dbTitle === 'shares' || dbTitle === 'bookmarks'
					? ''
					: 0}
			</span>
		</div>
	)
}

export default Posticons
