// importing css file, components, custom and react hooks, user context and axios library

import './listPage.css'

import {
	Actual,
	Input,
	Posts,
	PostsLoader,
	WhoToFollow,
} from '../../../components/index'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../../context/UserContext'
import { useLocalStorage } from '../../../utils/useLocalStorage'
import axios from 'axios'
import Layout from '../../../components/layout/Layout'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useOutsideClick } from '../../../utils/useOutsideClick'
import { RxCrossCircled } from 'react-icons/rx'
import { listSharePopup } from '../../../helpers/listSharePopup'

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

	const [inputName, setInputName] = useState({
		active: false,
		hasValue: false,
		label: '',
		value: '',
		maxCount: 25,
		name: 'Name',
	})

	const [inputDesc, setInputDesc] = useState({
		active: false,
		hasValue: false,
		label: '',
		value: '',
		maxCount: 100,
		name: 'Description',
	})

	const [activeEditList, setActiveEditList] = useState(false)

	const [isChecked, setIsChecked] = useState(false)

	const [currentCover, setCurrentCover] = useState()

	const [coverFile, setCoverFile] = useState()

	useEffect(() => {
		list?.name &&
			!inputName.value &&
			setInputName(prev => ({
				...prev,
				value: list?.name,
				hasValue: true,
			}))
		list?.desc &&
			!inputName.desc &&
			setInputDesc(prev => ({
				...prev,
				value: list?.desc,
				hasValue: true,
			}))
		list?.coverPicture && !currentCover && setCurrentCover(list?.coverPicture)
		list?.isPrivate && !isChecked && setIsChecked(list?.isPrivate)
	}, [list?.name, list?.desc, list?.isPrivate, list?.coverPicture])

	const changeListCover = async e => {
		try {
			setCoverFile(e.target.files[0])

			const formData = new FormData()
			const fileName =
				'c' +
				Math.random().toString(16).slice(2) +
				'.' +
				e.target.files[0]?.name.split('.')[1]

			formData.append('name', fileName)
			formData.append('files', e.target.files[0])

			await axios.post(`/upload`, formData)

			setCurrentCover(fileName)
		} catch (err) {
			console.log(err)
		}
	}

	const updateList = async () => {
		if (
			(!inputName.hasValue && inputName.value.length <= 1) ||
			(inputName.value === list?.name &&
				inputDesc.value === list?.desc &&
				isChecked === list?.isPrivate &&
				currentCover === undefined &&
				list?.coverPicture === null)
		) {
			return
		} else if (list?.coverPicture === currentCover) {
			return
		}
		try {
			await axios.put(`/lists/update/${list?._id}`, {
				name: inputName.value,
				desc: inputDesc.value,
				isPrivate: isChecked,
				coverPicture: currentCover === undefined ? null : currentCover,
			})
			document.location.reload()
		} catch (err) {
			console.log(err)
		}
	}

	const [deleteListModal, setDeleteListModal] = useState(false)

	const navigate = useNavigate()

	const deleteList = async () => {
		try {
			await axios.delete(`/lists/${list?._id}/delete`)
			navigate(`/${user?.userId}/lists`)
		} catch (err) {
			console.log(err)
		}
	}

	useEffect(() => {
		activeEditList && (document.body.style.overflowY = 'hidden')
	}, [activeEditList])

	const [followListBtn, setFollowListBtn] = useState('Follow')

	useEffect(() => {
		list?.followers.includes(user?._id)
			? setFollowListBtn('Following')
			: setFollowListBtn('Follow')
	}, [list?.followers, user?._id])

	const followList = async () => {
		try {
			await axios
				.put(`/lists/${list?._id}/follow`, {
					userDbId: user?._id,
				})
				.then(res => {
					if (res.data === 'Unfollowed') {
						setFollowListBtn('Follow')
						list.followers = list.followers.filter(item => item !== user?._id)
					} else if (res.data === 'Followed') {
						setFollowListBtn('Following')
						list.followers.push(user?._id)
					}
				})
		} catch (err) {
			console.log(err)
		}
	}

	const [morePopupActive, setMorePopupActive] = useState(false)

	const morePopup = useOutsideClick(() => setMorePopupActive(false))

	const [sharePopupActive, setSharePopupActive] = useState(false)

	const sharePopup = useOutsideClick(() => setSharePopupActive(false))

	const clickToShareItem = item => {
		if (item.img === 'link.svg') {
			navigator.clipboard.writeText(
				`http://localhost:3000/lists/${params.listId}`
			)
			setActiveAlert(true)
			setTimeout(() => setActiveAlert(false), 5000)
		}
	}

	const [activeAlert, setActiveAlert] = useState(false)

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
						<span className='profileTopTweetsCounter'>
							{list?.creator.userId}
						</span>
					</div>
					<div className='profileTopIconBlock'>
						<div
							className='profileTopIcon'
							onClick={() => setSharePopupActive(true)}
						>
							<img src={PF + 'icon/common/share.svg'} alt='' />
						</div>
						<div
							className={
								sharePopupActive ? 'sharePopupBlock active' : 'sharePopupBlock'
							}
							ref={sharePopup}
						>
							<div className='sharePopupContainer'>
								{listSharePopup.map(item => (
									<div
										className='sharePopupItem'
										onClick={() => {
											setSharePopupActive(false)
											clickToShareItem(item)
										}}
										key={item.id}
									>
										<img
											src={PF + 'icon/common/' + item.img}
											style={{
												transform: item.img === 'link.svg' && 'rotate(-45deg)',
											}}
											alt=''
										/>
										<h2>{item.text}</h2>
									</div>
								))}
							</div>
						</div>
						<div
							className='profileTopIcon'
							onClick={() => setMorePopupActive(true)}
						>
							<img src={PF + 'icon/utility/moreHorizontal.svg'} alt='' />
						</div>
						<div
							className={
								morePopupActive ? 'morePopupBlock active' : 'morePopupBlock'
							}
							ref={morePopup}
							onClick={() => setMorePopupActive(false)}
						>
							<div className='morePopupContainer'>
								<RxCrossCircled fontSize={30} />
								<div className='morePopupTextBlock'>
									<h2>Don’t show these posts in For you</h2>
									<span>
										Top posts from this List will no longer show up in your For
										you timeline.
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<img
					src={
						list?.coverPicture === 'defaultListCover.png' || !list?.coverPicture
							? PF + 'defaultListCover.png'
							: PF + 'storage/' + list?.coverPicture
					}
					className='listCoverImg'
				/>
				<div className='listPageData'>
					<h2 className='listPageName'>{list?.name || 'List'}</h2>
					<Link
						className='listItemInfoBottom listPageUser'
						to={`/${list?.creator.userId}`}
					>
						<img
							src={PF + 'storage/' + list?.creator.profilePicture}
							alt=''
							className='listItemInfoBottomCreatorAvatar'
						/>
						<p className='listItemInfoBottomUsername'>
							{list?.creator.username}
						</p>
						<span className='listItemInfoBottomUserId'>
							{list?.creator.userId}
						</span>
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
					{list?.creator._id === user?._id ? (
						<button
							className='editProfileButtons following'
							onClick={() => setActiveEditList(true)}
						>
							Edit List
						</button>
					) : (
						<button
							className={
								followListBtn === 'Unfollow'
									? 'editProfileButtons following redButton'
									: followListBtn === 'Follow'
									? 'editProfileButtons following blackButton'
									: 'editProfileButtons following'
							}
							onMouseOver={() => {
								followListBtn !== 'Follow' && setFollowListBtn('Unfollow')
							}}
							onMouseOut={() => {
								followListBtn !== 'Follow' && setFollowListBtn('Following')
							}}
							onClick={() => followList()}
						>
							{followListBtn}
						</button>
					)}
				</div>
				<hr className='postPageHr listPageHr' />
				{membersPosts.length === 0 && list?.members.length !== 0 ? (
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
					<div className='listPageNoPosts'>
						<div className='listPageNoPostsContainer'>
							<h1>Waiting for posts</h1>
							<span>Posts from people in this List will show up here.</span>
						</div>
					</div>
				)}
				<div
					className={activeEditList ? 'addListBlock active' : 'addListBlock'}
				>
					<div className='addListBlockContainer'>
						<div className='addListTop'>
							<div className='addListTopLeft'>
								<div
									className='addListCrossBlock'
									onClick={() => setActiveEditList(false)}
								>
									<img src={PF + 'icon/utility/x.svg'} alt='' />
								</div>
								<span className='addListTitle'>Edit List</span>
							</div>
							<button
								disabled={
									(!inputName.hasValue && inputName.value.length <= 1) ||
									(inputName.value === list?.name &&
										inputDesc.value === list?.desc &&
										isChecked === list?.isPrivate &&
										currentCover === undefined &&
										list?.coverPicture === null)
										? true
										: list?.coverPicture === currentCover
										? true
										: null
								}
								className={
									(!inputName.hasValue && inputName.value.length <= 1) ||
									(inputName.value === list?.name &&
										inputDesc.value === list?.desc &&
										isChecked === list?.isPrivate &&
										currentCover === undefined &&
										list?.coverPicture === null)
										? 'addListNextBtn disabled'
										: list?.coverPicture === currentCover
										? 'addListNextBtn disabled'
										: 'addListNextBtn'
								}
								onClick={updateList}
							>
								Done
							</button>
						</div>
						{/* list's cover */}
						<div
							className='editProfileBackgroundBlock'
							style={{ position: 'relative' }}
						>
							{currentCover === undefined ? (
								<div className='currentCover'>
									<img
										src={PF + 'defaultListCover.png'}
										alt=''
										className='coverImg'
									/>
									<div className='currentCoverOverlay'></div>
								</div>
							) : list?.coverPicture ? (
								<div className='currentCover'>
									<img
										src={PF + 'storage/' + list?.coverPicture}
										alt=''
										className='coverImg'
									/>
									<div className='currentCoverOverlay'></div>
								</div>
							) : (
								currentCover !== undefined && (
									<div className='currentCover'>
										<img
											src={PF + 'storage/' + currentCover}
											alt=''
											className='coverImg'
										/>
										<div className='currentCoverOverlay'></div>
									</div>
								)
							)}
							<div className='editProfileBackgroundAddPhotoIcons'>
								<label
									htmlFor='userCover'
									className='editProfileBackgroundAddPhotoBlock'
								>
									<img src={PF + 'icon/common/camera.svg'} alt='' />
									<input
										type='file'
										hidden
										id='userCover'
										onChange={e => changeListCover(e)}
									/>
								</label>
								{currentCover === undefined ? (
									false
								) : currentCover && !currentCover.match('undefined') ? (
									<div
										className='editProfileBackgroundAddPhotoBlock'
										onClick={() => setCurrentCover()}
									>
										<img src={PF + 'icon/utility/xWhite.svg'} alt='' />
									</div>
								) : (
									list?.coverPicture && (
										<div
											className='editProfileBackgroundAddPhotoBlock'
											onClick={() => {
												setCurrentCover('none')
											}}
										>
											<img src={PF + 'icon/utility/xWhite.svg'} alt='' />
										</div>
									)
								)}
							</div>
						</div>
						{/* list's name and desc */}
						<div className='addListForm listPageForm'>
							<div className='addListFormContainer'>
								<Input inputState={inputName} setInputState={setInputName} />

								<Input inputState={inputDesc} setInputState={setInputDesc} />

								<div className='addListRadioInputBlock'>
									<div className='addListRadioInputBlockTextBlock'>
										<span className='addListRadioInputBlockText'>
											Make private
										</span>
										<span className='addListRadioInputBlockAddition'>
											When you make a List private, only you can see it.
										</span>
									</div>
									<div className='checkboxBlock'>
										<input
											type='checkbox'
											defaultChecked={isChecked}
											onClick={() => setIsChecked(!isChecked)}
										/>
									</div>
								</div>
							</div>
							<hr className='postPageHr listPageHr' />
							<div className='manageMembersBlock'>
								<p>Manage members</p>
								<img src={PF + 'icon/utility/chevronRight.svg'} alt='' />
							</div>
							<div
								className='deleteListBlock'
								onClick={() => setDeleteListModal(true)}
							>
								Delete List
							</div>
						</div>
					</div>
					<div className='overlay' onClick={() => setActiveEditList(false)} />
				</div>
				<div
					className={
						deleteListModal ? 'deleteListModal active' : 'deleteListModal'
					}
				>
					<div className='deleteListModalBlock'>
						<div className='deleteListModalContainer'>
							<h2>Delete List?</h2>
							<span>This can’t be undone and you’ll lose your List. </span>
							<div className='deleteListModalBtnBlock'>
								<button
									className='deleteListModalDeleteBtn'
									onClick={deleteList}
								>
									Delete
								</button>
								<button
									className='deleteListModalCancelBtn'
									onClick={() => setDeleteListModal(false)}
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
					<div
						className='overlay'
						onClick={() => setDeleteListModal(false)}
					></div>
				</div>
				<div className={activeAlert ? 'alertBlock active' : 'alertBlock'}>
					Copied to clipboard
				</div>
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
