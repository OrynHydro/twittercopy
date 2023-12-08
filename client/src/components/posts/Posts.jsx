// importing css file, react hooks, momentjs, axios, swiperjs and react-loading-skeleton libraries

import './posts.css'
import { useEffect, useState } from 'react'
import { PostIcons, PostIconsPostPage } from '../../helpers/post'
import {
	postMoreUserItem,
	postMoreNotUserItem,
} from '../../helpers/postMoreItems'

import Posticons from './posticons/Posticons'
import PostMoreItem from './postMoreItem/PostMoreItem'
import { Link, useNavigate } from 'react-router-dom'
import moment from 'moment'
import 'react-loading-skeleton/dist/skeleton.css'
import axios from 'axios'

import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import 'swiper/css'
import 'swiper/css/navigation'

import { useInView } from 'react-intersection-observer'
import { useOutsideClick } from '../../utils/useOutsideClick'
import UserPopup from '../userPopup/UserPopup'
import { DefaultPlayer as Video } from 'react-html5video'
import 'react-html5video/dist/styles.css'
import { BsPinFill } from 'react-icons/bs'
import AddUserModal from '../lists/addUserModal/AddUserModal'
import { FaRetweet } from 'react-icons/fa6'

const Posts = ({
	post,
	more,
	moreActive,
	currentUser,
	isUserPosts,
	activeFollowBtn,
	setActiveFollowBtn,
	unfollow,
	setUnfollow,
	postPage,
	isReply,
	listPage,
	noPin,
	notification,
	isRetweet,
}) => {
	// declaring state of more icon

	const [activeMore, setActiveMore] = useState(false)

	const navigate = useNavigate()

	// declaring variable that helps to get images from folder directly without importing

	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	// declaring state of full screen img

	const [fullScreenImg, setFullScreenImg] = useState()

	useEffect(() => {
		fullScreenImg
			? (document.body.style.overflowY = 'hidden')
			: (document.body.style.overflowY = 'scroll')
	}, [fullScreenImg])

	// list of icons in full screen img bottombar

	const fullScreenIcons = [
		{
			id: 1,
			common: PF + 'icon/colored/messageWhite.svg',
			title: 'Reply',
			dbTitle: 'replies',
		},
		{
			id: 2,
			common: PF + 'icon/colored/retweetWhite.svg',
			title: 'Retweet',
			dbTitle: 'retweets',
		},
		{
			id: 3,
			common: PF + 'icon/colored/heartWhite.svg',
			title: 'Like',
			dbTitle: 'likes',
		},
		{
			id: 4,
			common: PF + 'icon/colored/shareWhite.svg',
			title: 'Share',
			dbTitle: 'shares',
		},
	]

	// liking post

	const [like, setLike] = useState(post?.likes?.length)
	const [isLiked, setIsLiked] = useState(false)

	const likePost = async isLikeTitle => {
		if (isLikeTitle) {
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
	}

	useEffect(() => {
		setIsLiked(post?.likes.includes(currentUser?._id))
	}, [post?.likes, currentUser?._id])

	// adding a view to post

	const { ref, inView } = useInView({
		triggerOnce: true,
	})

	const viewPost = async () => {
		try {
			if (notification) {
				axios.put(`/notifications/${notification}/read`)
			}
			await axios.put(`/posts/${post?._id}/update`, {
				userId: post?.user?._id,
				views: post?.views + 1,
			})
		} catch (err) {
			console.log(err)
		}
	}

	if (inView) viewPost()

	const [popupWindow, setPopupWindow] = useState(false)

	const popup = useOutsideClick(() => setPopupWindow(false))

	const [deleteModal, setDeleteModal] = useState(false)

	const deletePost = async e => {
		e.preventDefault()
		try {
			if (post?.likes.includes(currentUser?._id)) {
				await axios.put(`/posts/${post?._id}/like`, {
					userId: currentUser?._id,
				})
			}
			if (post?.originalPost) {
				await axios.put(`/posts/${post?.originalPost}/update`, {
					replyId: post?._id,
				})
			}
			await axios.delete(`/posts/${post?._id}/delete`)
			document.location.reload()
		} catch (err) {
			console.log(err)
		}
	}

	deleteModal
		? (document.body.style.overflowY = 'hidden')
		: (document.body.style.overflowY = 'scroll')

	const [openModal, setOpenModal] = useState(false)
	const [modalText, setModalText] = useState(
		!currentUser?.following.includes(post?.user?.userId)
			? 'Following'
			: 'Follow'
	)

	useEffect(() => {
		if (currentUser?.following.includes(post?.user?._id)) {
			setModalText('Following')
		} else {
			setModalText('Follow')
		}
	}, [currentUser?.following, post?.user?._id])

	const followUser = async e => {
		e.preventDefault()
		if (currentUser?.following.includes(post?.user?._id)) {
			try {
				await axios.put(`/users/${post?.user?._id}/unfollow`, {
					userId: currentUser._id,
				})
				setModalText('Follow')
				currentUser.following.splice(
					currentUser.following.indexOf(post?.user?._id),
					1
				)
				post?.user?.followers.splice(
					post?.user?.followers.indexOf(post?.user?._id),
					1
				)
			} catch (err) {
				console.log(err)
			}
		} else if (!currentUser?.following.includes(post?.user?._id)) {
			try {
				await axios.put(`/users/${post?.user?._id}/follow`, {
					userId: currentUser._id,
				})
				setModalText('Following')
				currentUser.following.push(post?.user?._id)
				post?.user?.followers.push(currentUser._id)
			} catch (err) {
				console.log(err)
			}
		}
	}

	const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg']

	const videoExtensions = ['mp4', 'webm', 'ogv', 'avi', 'mkv', 'mov']

	useEffect(() => {
		if (!unfollow) return
		if (!listPage) return
		setActiveFollowBtn('Follow')
		setUnfollow(false)
		currentUser.following = currentUser.following.filter(
			item => item !== post.user?._id
		)
		post.user.followers = post.user?.followers.filter(
			item => item !== post.user?._id
		)
	}, [unfollow, listPage])

	const [isPinned, setIsPinned] = useState(false)

	useEffect(() => {
		currentUser?.pinnedPost === post?._id && setIsPinned(true)
	}, [currentUser?.pinnedPost, post?._id])

	const [activeAddUser, setActiveAddUser] = useState(false)

	return (
		<Link
			className={
				postPage
					? 'homePost postPagePost'
					: notification
					? 'homePost notificationPost'
					: 'homePost'
			}
			ref={ref}
			to={postPage ? false : `/${post?.user.userId}/status/${post?._id}`}
		>
			<div
				className={
					postPage ? 'homePostContainer postPageContainer' : 'homePostContainer'
				}
				style={{
					paddingLeft: isReply === 'reply' && '75px',
				}}
			>
				{isReply === 'original' && (
					<hr className='verticalLine' style={{ top: '70px' }} />
				)}
				{isPinned && !postPage && !noPin ? (
					<div className='pinnedBlock'>
						<BsPinFill color='#536471' fontSize={16} />
						<span>Pinned</span>
					</div>
				) : (
					isRetweet && (
						<div className='pinnedBlock'>
							<FaRetweet color='#536471' fontSize={16} />
							<span>Retweeted</span>
						</div>
					)
				)}
				{/* user avatar, name, id and when post was created */}
				<div className='homePostTop'>
					<div
						className={
							postPage ? 'homePostTopInfo postPageInfo' : 'homePostTopInfo'
						}
						onMouseOver={() => setTimeout(() => setOpenModal(true), 500)}
						onMouseOut={() => setTimeout(() => setOpenModal(false), 500)}
					>
						<Link to={`/${post?.user.userId}`} style={{ zIndex: '100' }}>
							<img
								className='homePostUserImg'
								src={
									post && !post?.user?.profilePicture
										? PF + 'icon/noAvatar.png'
										: PF + 'storage/' + post?.user?.profilePicture
								}
								onClick={() => navigate(`/${post?.user.userId}`)}
							/>
						</Link>

						{notification ? (
							<div className='replyNotificationBlock'>
								<div
									className={
										postPage
											? 'homePostUserInfo postPageInfo'
											: 'homePostUserInfo'
									}
								>
									<Link to={`/${post?.user.userId}`}>
										<h2 className='homePostUsername'>{post?.user?.username}</h2>
									</Link>
									<Link to={`/${post?.user.userId}`}>
										<span className='homePostUserId'>{post?.user?.userId}</span>
									</Link>

									{!postPage && (
										<span className='homePostDate'>
											{moment(post?.createdAt).fromNow()}
										</span>
									)}
								</div>
								<p className='replyingText'>
									Replying to{' '}
									<Link to={`/${currentUser?.userId}`}>
										{currentUser?.userId}
									</Link>
								</p>
							</div>
						) : (
							<div
								className={
									postPage
										? 'homePostUserInfo postPageInfo'
										: 'homePostUserInfo'
								}
							>
								<Link to={`/${post?.user.userId}`}>
									<h2 className='homePostUsername'>{post?.user?.username}</h2>
								</Link>
								<Link to={`/${post?.user.userId}`}>
									<span className='homePostUserId'>{post?.user?.userId}</span>
								</Link>

								{!postPage && (
									<span className='homePostDate'>
										{moment(post?.createdAt).fromNow()}
									</span>
								)}
							</div>
						)}

						<div style={{ position: 'absolute', top: '-10px' }}>
							<UserPopup
								modalText={modalText}
								setModalText={setModalText}
								userDbId={post?.user?._id}
								currentUser={currentUser}
								followUser={followUser}
								userId={post?.user?.userId}
								username={post?.user?.username}
								followers={post?.user?.followers}
								following={post?.user?.following}
								profilePicture={post?.user?.profilePicture}
								openModal={openModal}
							/>
						</div>
					</div>
					<div
						className='homePostMoreBlock'
						title='More'
						onMouseOver={() => setActiveMore(true)}
						onMouseOut={() => setActiveMore(false)}
						onClick={e => {
							e.preventDefault()
							setPopupWindow(true)
						}}
					>
						<img src={activeMore ? moreActive : more} alt='' />
					</div>
				</div>
				{/* post image and desc */}
				<div className={postPage ? 'homePostMid postPageMid' : 'homePostMid'}>
					<span className='homePostDesc'>{post?.desc}</span>
					{post?.img?.length === 3 ? (
						<div
							className='postImagesContainer three'
							onClick={e => e.preventDefault()}
						>
							<div className='column'>
								<img
									src={post?.img[0] && PF + 'storage/' + post?.img[0]}
									className='homePostImg'
									onClick={() => setFullScreenImg([post?.img[0], post])}
									key={1}
								/>
							</div>
							<div className='column'>
								<img
									src={post?.img[1] && PF + 'storage/' + post?.img[1]}
									className='homePostImg'
									onClick={() => setFullScreenImg([post?.img[0], post])}
									key={2}
								/>
								<img
									src={post?.img[2] && PF + 'storage/' + post?.img[2]}
									className='homePostImg'
									onClick={() => setFullScreenImg([post?.img[0], post])}
									key={3}
								/>
							</div>
						</div>
					) : (
						<div
							className={
								post?.img?.length === 1
									? ''
									: post?.img?.length === 2
									? 'postImagesContainer two'
									: post?.img?.length === 4
									? 'postImagesContainer four'
									: ''
							}
							onClick={e => e.preventDefault()}
						>
							{post?.img?.map((link, index) => (
								<>
									{imageExtensions.includes(link.split('.')[1]) ? (
										<img
											src={link && PF + 'storage/' + link}
											onClick={() => setFullScreenImg([link, post])}
											className='homePostImg'
											key={index}
										/>
									) : (
										videoExtensions.includes(link.split('.')[1]) && (
											<Video
												className='homePostImg'
												autoPlay
												loop
												key={index}
												style={{ width: isReply && '452px' }}
											>
												<source src={link && PF + 'storage/' + link} />
											</Video>
										)
									)}
								</>
							))}
						</div>
					)}
				</div>
				{postPage && (
					<div className='postPageData'>
						<span className='postPageTime'>
							{moment(post.createdAt).format('h:mm A')} ·{' '}
							{moment(post.createdAt).format('MMM d, yyyy')}
						</span>{' '}
						·{' '}
						<span className='postPageViews'>
							<strong>{post.views}</strong> Views
						</span>
					</div>
				)}

				{postPage && <hr className='postPageHr' />}
				{/* post icons  */}
				<div
					className={
						isReply === 'reply'
							? 'homePostBottom replyBottom'
							: postPage
							? 'homePostBottom postPageBottom'
							: 'homePostBottom'
					}
				>
					{postPage
						? PostIconsPostPage?.map(i => {
								return (
									<Posticons
										key={i.id}
										icon={i.icon}
										iconColoured={i.iconColoured}
										color={i.color}
										hoverColor={i.hoverColor}
										title={i.title}
										post={post}
										userId={post?.userId}
										dbTitle={i.dbTitle}
										like={like}
										setLike={setLike}
										isLiked={isLiked}
										setIsLiked={setIsLiked}
										currentUser={currentUser}
									/>
								)
						  })
						: PostIcons?.map(i => {
								return (
									<Posticons
										key={i.id}
										icon={i.icon}
										iconColoured={i.iconColoured}
										color={i.color}
										hoverColor={i.hoverColor}
										title={i.title}
										post={post}
										userId={post?.userId}
										dbTitle={i.dbTitle}
										like={like}
										setLike={setLike}
										isLiked={isLiked}
										setIsLiked={setIsLiked}
										currentUser={currentUser}
									/>
								)
						  })}
				</div>
				{postPage && <hr className='postPageHr' />}
			</div>
			{/* full screen img block */}
			{fullScreenImg && post && (
				<div className='fullScreenImg'>
					<div
						className='fullScreenImgCross'
						onClick={() => setFullScreenImg(null)}
						title='Close'
					>
						<img src={PF + 'icon/utility/xWhite.svg'} alt='' />
					</div>
					<Swiper
						modules={[Navigation]}
						navigation
						allowTouchMove={false}
						speed={500}
						onClick={() => setFullScreenImg(null)}
					>
						{post.img?.map((item, index) => (
							<SwiperSlide>
								<>
									{imageExtensions.includes(item.split('.')[1]) ? (
										<img
											src={PF + 'storage/' + item}
											className='fullScreenImgBlock'
											key={index}
										/>
									) : (
										videoExtensions.includes(item.split('.')[1]) && (
											<Video
												className='fullScreenImgBlock'
												autoPlay
												loop
												key={index}
											>
												<source src={PF + 'storage/' + item} />
											</Video>
										)
									)}
								</>
							</SwiperSlide>
						))}
					</Swiper>

					<div className='fullScreenImgIconContainer'>
						{fullScreenIcons?.map(item => (
							<div
								className='fullScreenImgIconBlock'
								title={item.title}
								onClick={() => likePost(item.title === 'Like' && true)}
							>
								<div className='fullScreenImgIconImgBlock'>
									<img
										src={
											item.title === 'Like' && like
												? PF + 'icon/colored/heartColour.svg'
												: item.common
										}
										alt=''
									/>
								</div>
								<span className='fullScreenImgIconBlockCounter'>
									{item.title === 'Reply'
										? fullScreenImg[1]?.replies?.length
										: item.title === 'Retweet'
										? fullScreenImg[1]?.retweets?.length
										: item.title === 'Like'
										? like
										: ''}
								</span>
							</div>
						))}
					</div>
					<div
						className='fullScreenImgOverlay'
						onClick={() => setFullScreenImg(null)}
					/>
				</div>
			)}
			<div
				className='popupWindow'
				style={{
					opacity: popupWindow ? '1' : '0',
					zIndex: popupWindow ? '1000' : '-1',
				}}
				ref={popup}
			>
				{isUserPosts
					? postMoreUserItem.map((item, id) => (
							<PostMoreItem
								key={id}
								title={item.title}
								icon={item.icon}
								userId={post?.user?.userId}
								setDeleteModal={setDeleteModal}
								setPopupWindow={setPopupWindow}
								isUserPosts={isUserPosts}
								post={post}
								user={currentUser}
								isPinned={isPinned}
								setIsPinned={setIsPinned}
								activeAddUser={activeAddUser}
								setActiveAddUser={setActiveAddUser}
							/>
					  ))
					: postMoreNotUserItem.map((item, id) => (
							<PostMoreItem
								key={id}
								title={item.title}
								icon={item.icon}
								setDeleteModal={setDeleteModal}
								setPopupWindow={setPopupWindow}
								activeFollowBtn={activeFollowBtn}
								setActiveFollowBtn={setActiveFollowBtn}
								unfollow={unfollow}
								setUnfollow={setUnfollow}
								post={post}
								user={currentUser}
								activeAddUser={activeAddUser}
								setActiveAddUser={setActiveAddUser}
							/>
					  ))}
			</div>
			<div
				className='deletePostModalWindow'
				style={{
					display: deleteModal ? 'block' : 'none',
				}}
			>
				<div className='deletePostModalContainer'>
					<h2>Delete post?</h2>
					<p>
						This can’t be undone and it will be removed from your profile, the
						timeline of any accounts that follow you, and from search results.{' '}
					</p>
					<div className='buttonBlock'>
						<button className='deleteBtn' onClick={e => deletePost(e)}>
							Delete
						</button>
						<button
							className='cancelBtn'
							onClick={e => {
								e.preventDefault()
								setDeleteModal(false)
								setPopupWindow(true)
							}}
						>
							Cancel
						</button>
					</div>
				</div>
				<div
					className='overlay'
					onClick={e => {
						e.preventDefault()
						setDeleteModal(false)
					}}
				></div>
			</div>
			<AddUserModal
				active={activeAddUser}
				setActive={setActiveAddUser}
				user={currentUser}
				post={post}
			/>
		</Link>
	)
}

export default Posts
