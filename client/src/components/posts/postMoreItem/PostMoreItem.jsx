import axios from 'axios'
import { BsPinFill } from 'react-icons/bs'

const PostMoreItem = ({
	title,
	icon,
	userId,
	setDeleteModal,
	setPopupWindow,
	isUserPosts,
	activeFollowBtn,
	setActiveFollowBtn,
	setUnfollow,
	post,
	user,
	isPinned,
	setIsPinned,
}) => {
	const addUserToList = async () => {
		// await axios.put(`/lists/addToList/`)
	}

	const pinPost = async () => {
		await axios
			.put(`/users/pinPost/${user._id}`, {
				postId: post._id,
			})
			.then(res =>
				res.data === 'Pinned'
					? (user.pinnedPost = post?._id)
					: (user.pinnedPost = null)
			)
		setIsPinned(!isPinned)
	}

	const followUser = async () => {
		if (user?.following.includes(post.user?._id)) {
			try {
				await axios.put(`/users/${post.user?._id}/unfollow`, {
					userId: user?._id,
				})
				user.following = user.following.filter(item => item !== user._id)
				post.user.followers = post.user?.followers.filter(
					item => item !== user?._id
				)
				setActiveFollowBtn('Follow')
				setUnfollow(true)
				setPopupWindow(false)
			} catch (err) {
				console.log(err)
			}
		} else if (!user?.following.includes(post.user?._id)) {
			try {
				await axios.put(`/users/${post.user?._id}/follow`, {
					userId: user?._id,
				})
				user.following.push(post.user?._id)
				post.user.followers.push(user?._id)
				setActiveFollowBtn('Following')
				setPopupWindow(false)
			} catch (err) {
				console.log(err)
			}
		}
	}

	const postMoreItemAction = async (title, e) => {
		e.preventDefault()
		if (title === 'Add/remove') {
			addUserToList()
		}
		if (title === 'Pin to your profile') {
			pinPost()
		}
		if (title === 'Follow') {
			followUser()
		}
		setPopupWindow(false)
	}

	return (
		<>
			{isUserPosts ? (
				<div
					className={
						title === 'Delete' ? 'popupWindowItem special' : 'popupWindowItem'
					}
					onClick={e => {
						title === 'Delete' && setDeleteModal(true)
						title === 'Delete' && setPopupWindow(false)
						postMoreItemAction(title, e)
					}}
				>
					{title === 'Highlight on your profile' ||
					title === 'Pin to your profile' ? (
						<>
							{title === 'Pin to your profile' && isPinned ? (
								<BsPinFill />
							) : (
								icon
							)}
						</>
					) : (
						<img src={icon} alt='' />
					)}

					{title !== 'Add/remove' ? (
						<span>
							{title === 'Pin to your profile' && isPinned
								? 'Unpin from profile'
								: title}
						</span>
					) : (
						<span>
							{title} {userId} from Lists
						</span>
					)}
				</div>
			) : (
				<div
					className={'popupWindowItem'}
					onClick={e => postMoreItemAction(title, e)}
				>
					{icon}
					{title === 'Add/remove' ? (
						<span>
							{title} {post.user?.userId} from Lists
						</span>
					) : title === 'Mute' || title === 'Block' ? (
						<span>
							{title} {post.user?.userId}
						</span>
					) : title === 'Follow' ? (
						<span>
							{activeFollowBtn !== 'Follow'
								? `Unfollow ${post.user.userId}`
								: `Follow ${post.user.userId}`}
						</span>
					) : (
						<span>{title}</span>
					)}
				</div>
			)}
		</>
	)
}

export default PostMoreItem
