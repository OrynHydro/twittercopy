// importing css file, react hooks, momentjs, axios, swiperjs and react-loading-skeleton libraries

import './posts.css'
import { useEffect, useState } from 'react'
import { PostIcons, PostIconsPostPage } from '../../helpers/post'
import {
	postMoreUserItem,
	postMoreNotUserItem,
} from '../../helpers/postMoreItems'

import Posticons from './posticons/Posticons'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
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

const PostMoreItem = ({
	title,
	icon,
	userId,
	setDeleteModal,
	setPopupWindow,
	isUserPosts,
	currentUser,
	userDbId,
	postAuthor,
	activeFollowBtn,
	setActiveFollowBtn,
	unfollow,
	setUnfollow,
}) => {
	const followUser = async title => {
		if (title !== 'Follow') return
		if (currentUser?.following.includes(postAuthor?._id)) {
			try {
				await axios.put(`/users/${postAuthor?._id}/unfollow`, {
					userId: currentUser?._id,
				})
				currentUser.following = currentUser.following.filter(
					item => item !== userDbId
				)
				postAuthor.followers = postAuthor?.followers.filter(
					item => item !== currentUser?._id
				)
				setActiveFollowBtn('Follow')
				setUnfollow(true)
				setPopupWindow(false)
			} catch (err) {
				console.log(err)
			}
		} else if (!currentUser?.following.includes(postAuthor?._id)) {
			try {
				await axios.put(`/users/${postAuthor?._id}/follow`, {
					userId: currentUser?._id,
				})
				currentUser.following.push(postAuthor?._id)
				postAuthor.followers.push(currentUser?._id)
				setActiveFollowBtn('Following')
				setPopupWindow(false)
			} catch (err) {
				console.log(err)
			}
		}
	}

	// useEffect(() => {
	// 	currentUser?.following.includes(postAuthor?._id) && activeFollowBtn
	// 		? setActiveFollowBtn('Following')
	// 		: activeFollowBtn && setActiveFollowBtn('Follow')
	// }, [currentUser?.following, postAuthor?._id, activeFollowBtn])

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
						e.preventDefault()
					}}
				>
					{title === 'Highlight on your profile' ||
					title === 'Pin to your profile' ? (
						<>{icon}</>
					) : (
						<img src={icon} alt='' />
					)}

					{title !== 'Add/remove' ? (
						<span>{title}</span>
					) : (
						<span>
							{title} {userId} from Lists
						</span>
					)}
				</div>
			) : (
				<div
					className={'popupWindowItem'}
					onClick={e => {
						followUser(title)
						e.preventDefault()
					}}
				>
					<>{icon}</>
					{title === 'Add/remove' ? (
						<span>
							{title} {postAuthor?.userId} from Lists
						</span>
					) : title === 'Mute' || title === 'Block' ? (
						<span>
							{title} {postAuthor?.userId}
						</span>
					) : title === 'Follow' ? (
						<span>
							{activeFollowBtn !== 'Follow'
								? `Unfollow ${postAuthor.userId}`
								: `Follow ${postAuthor.userId}`}
						</span>
					) : (
						<span>{title}</span>
					)}
				</div>
			)}
		</>
	)
}

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
			} catch (err) {
				console.log(err)
			}
		}
	}

	useEffect(() => {
		setIsLiked(currentUser?.likedPosts.includes(post?._id))
	}, [currentUser?.likedPosts, post?._id])

	// adding a view to post

	const { ref, inView } = useInView({
		triggerOnce: true,
	})

	const viewPost = async () => {
		try {
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

	const deletePost = async () => {
		try {
			if (post?.likes.includes(currentUser?._id)) {
				await axios.put(`/posts/${post?._id}/like`, {
					userId: currentUser?._id,
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

	if (postPage)
		return (
			<div className='homePost postPagePost' ref={ref}>
				<div className='homePostContainer postPageContainer'>
					{/* user avatar, name, id and when post was created */}
					<div className='homePostTop'>
						<div
							className='homePostTopInfo'
							onMouseOver={() => setOpenModal(true)}
							onMouseOut={() => setOpenModal(false)}
						>
							<img
								className='homePostUserImg'
								src={
									post && !post?.user?.profilePicture
										? PF + 'icon/noAvatar.png'
										: PF + 'storage/' + post?.user?.profilePicture
								}
								onClick={() => navigate(`/${post?.user.userId}`)}
							/>
							<div className='homePostUserInfo postPageInfo'>
								<h2 className='homePostUsername'>{post?.user?.username}</h2>
								<span className='homePostUserId'>{post?.user?.userId}</span>
							</div>
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
							onClick={() => setPopupWindow(true)}
						>
							<img src={activeMore ? moreActive : more} alt='' />
						</div>
					</div>
					{/* post image and desc */}
					<div className='homePostMid postPageMid'>
						<span className='homePostDesc'>{post?.desc}</span>
						{post?.img?.length === 3 ? (
							<div className='postImagesContainer three'>
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
							>
								{post?.img?.map((link, id) => (
									<img
										src={link && PF + 'storage/' + link}
										onClick={() => setFullScreenImg([link, post])}
										className='homePostImg'
										key={id}
									/>
								))}
							</div>
						)}
					</div>
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
					<hr className='postPageHr' />
					{/* post icons  */}
					<div className='homePostBottom postPageBottom'>
						{PostIconsPostPage?.map(i => {
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
					<hr className='postPageHr' />
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
							{post.img?.map(item => (
								<SwiperSlide>
									<img
										src={PF + 'storage/' + item}
										className='fullScreenImgBlock'
										alt=''
									/>
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
						display: popupWindow ? 'block' : 'none',
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
								/>
						  ))
						: postMoreNotUserItem.map((item, id) => (
								<PostMoreItem
									key={id}
									title={item.title}
									icon={item.icon}
									postAuthor={post?.user}
									setDeleteModal={setDeleteModal}
									setPopupWindow={setPopupWindow}
									currentUser={currentUser}
									activeFollowBtn={activeFollowBtn}
									setActiveFollowBtn={setActiveFollowBtn}
									unfollow={unfollow}
									setUnfollow={setUnfollow}
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
							<button className='deleteBtn' onClick={deletePost}>
								Delete
							</button>
							<button
								className='cancelBtn'
								onClick={() => setDeleteModal(false)}
							>
								Cancel
							</button>
						</div>
					</div>
					<div className='overlay' onClick={() => setDeleteModal(false)}></div>
				</div>
			</div>
		)

	return (
		<Link
			className='homePost'
			ref={ref}
			to={`/${post?.user.userId}/status/${post?._id}`}
		>
			<div className='homePostContainer'>
				{/* user avatar, name, id and when post was created */}
				<div className='homePostTop'>
					<div
						className='homePostTopInfo'
						onMouseOver={() => setOpenModal(true)}
						onMouseOut={() => setOpenModal(false)}
					>
						<Link to={`/${post?.user.userId}`}>
							<img
								className='homePostUserImg'
								src={
									post && !post?.user?.profilePicture
										? PF + 'icon/noAvatar.png'
										: PF + 'storage/' + post?.user?.profilePicture
								}
							/>
						</Link>

						<div className='homePostUserInfo'>
							<Link to={`/${post?.user.userId}`}>
								<h2 className='homePostUsername'>{post?.user?.username}</h2>
							</Link>
							<Link to={`/${post?.user.userId}`}>
								<span className='homePostUserId'>{post?.user?.userId}</span>
							</Link>

							<span className='homePostDate'>
								{moment(post?.createdAt).fromNow()}
							</span>
						</div>
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
				<div className='homePostMid'>
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
							{post?.img?.map((link, id) => (
								<img
									src={link && PF + 'storage/' + link}
									onClick={() => setFullScreenImg([link, post])}
									className='homePostImg'
									key={id}
								/>
							))}
						</div>
					)}
				</div>
				{/* post icons  */}
				<div className='homePostBottom'>
					{PostIcons?.map(i => {
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
						{post.img?.map(item => (
							<SwiperSlide>
								<img
									src={PF + 'storage/' + item}
									className='fullScreenImgBlock'
									alt=''
								/>
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
					display: popupWindow ? 'block' : 'none',
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
							/>
					  ))
					: postMoreNotUserItem.map((item, id) => (
							<PostMoreItem
								key={id}
								title={item.title}
								icon={item.icon}
								postAuthor={post?.user}
								setDeleteModal={setDeleteModal}
								setPopupWindow={setPopupWindow}
								currentUser={currentUser}
								activeFollowBtn={activeFollowBtn}
								setActiveFollowBtn={setActiveFollowBtn}
								unfollow={unfollow}
								setUnfollow={setUnfollow}
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
						<button className='deleteBtn' onClick={deletePost}>
							Delete
						</button>
						<button className='cancelBtn' onClick={() => setDeleteModal(false)}>
							Cancel
						</button>
					</div>
				</div>
				<div className='overlay' onClick={() => setDeleteModal(false)}></div>
			</div>
		</Link>
	)
}

export default Posts
