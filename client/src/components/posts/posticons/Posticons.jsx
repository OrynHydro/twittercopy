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
	postPage,
}) => {
	// declaring state of icons

	const [activeIcon, setActiveIcon] = useState(false)
	const likePost = async () => {
		if (title === 'Like') {
			try {
				await axios.put(`/posts/${post[0]?._id}/like`, {
					userId: currentUser?._id,
				})
				setLike(isLiked ? like - 1 : like + 1)
				setIsLiked(!isLiked)
			} catch (err) {
				console.log(err)
			}
		}
	}

	// get info if post is liked by user

	// useEffect(() => {
	//     setIsLiked(currentUser?.likedPosts.includes(post[0]?._id))
	// }, [currentUser?.likedPosts, post[0]?._id])

	// console.log(currentUser.likedPosts)

	return (
		<div
			className='homePostIconBlock'
			title={title}
			onMouseOver={() => setActiveIcon(true)}
			onMouseOut={() => setActiveIcon(false)}
			onClick={likePost}
		>
			<div
				className='homePostIconImgBlock'
				style={{ backgroundColor: activeIcon ? hoverColor : null }}
			>
				<img
					src={
						(title === 'Like' && isLiked) || activeIcon ? iconColoured : icon
					}
					alt=''
				/>
			</div>
			<span
				className='homePostIconCounter'
				style={{
					color:
						(title === 'Like' && isLiked) || activeIcon ? color : '#84909a',
				}}
			>
				{dbTitle === 'likes'
					? like
					: dbTitle === 'replies'
					? post[0]?.replies?.length
					: dbTitle === 'retweets'
					? post[0]?.retweets?.length
					: dbTitle === 'views'
					? post[0].views
					: dbTitle === 'shares'
					? ''
					: 0}
			</span>
		</div>
	)
}

export default Posticons
