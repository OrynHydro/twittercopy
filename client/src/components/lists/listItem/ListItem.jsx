import axios from 'axios'
import { useEffect, useState } from 'react'
import { BsFillPlusCircleFill, BsPin, BsPinFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import ListPopup from '../listPopup/ListPopup'
import { AiOutlineCheck } from 'react-icons/ai'
import { IoCheckmark, IoCheckmarkCircleOutline } from 'react-icons/io5'
import { LuPlus } from 'react-icons/lu'

const ListItem = ({
	list,
	user,
	noPin,
	addUser,
	setActiveAddUser,
	chosenLists,
	setChosenLists,
	activeAddUser,
	search,
	followBtn,
}) => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER
	const formatNumber = number => {
		if (number >= 1000000) {
			return (number / 1000000).toFixed(1) + 'M'
		} else if (number >= 1000) {
			return (number / 1000).toFixed(1) + 'K'
		} else {
			return number.toString()
		}
	}

	const pinList = async e => {
		e.preventDefault()
		try {
			await axios
				.put(`/users/pinList/${user?._id}`, {
					listId: list?._id,
				})
				.then(res =>
					res.data === 'Pinned'
						? setPinned(true)
						: res.data === 'Unpinned' && setPinned(false)
				)
		} catch (err) {
			console.log(err)
		}
	}

	const [pinned, setPinned] = useState(false)

	useEffect(() => {
		!addUser &&
			user?.pinnedLists.some(pinnedList => pinnedList._id === list._id) &&
			setPinned(true)
	}, [user?.pinnedLists, list, addUser])

	const [activePopup, setActivePopup] = useState(false)

	useEffect(() => {
		if (list?.creator[0]) {
			list.creator = list.creator[0]
		}
	}, [list?.creator])

	const [hoverFollowBtn, setHoverFollowBtn] = useState({
		hover: false,
		type: list.followers.some(follower => follower._id === user._id)
			? 'unfollow'
			: 'follow',
	})

	const handleFollowClick = async e => {
		e.preventDefault()
		const res = await axios.put(`/lists/${list._id}/follow`, {
			userDbId: user._id,
		})
		setHoverFollowBtn(prev => ({
			...prev,
			type: res.data === 'Followed' ? 'unfollow' : 'follow',
		}))
	}

	return (
		<Link
			className='listItem'
			to={addUser ? false : `/lists/${list._id}`}
			onClick={() =>
				addUser && chosenLists.includes(list._id) && activeAddUser
					? setChosenLists(chosenLists.filter(id => id !== list?._id))
					: addUser &&
					  !chosenLists.includes(list._id) &&
					  activeAddUser &&
					  setChosenLists([...chosenLists, list?._id])
			}
		>
			<div className='listItemContainer'>
				<div className='listItemLeft'>
					<img
						src={
							list?.coverPicture
								? PF + 'storage/' + list?.coverPicture
								: PF + 'defaultListCover.png'
						}
						alt=''
						className='listItemImg'
					/>
					<div className='listItemInfo'>
						<div
							className='listItemInfoTop'
							onMouseOver={() => setTimeout(() => setActivePopup(true), 500)}
							onMouseOut={() => setTimeout(() => setActivePopup(false), 500)}
						>
							<h3 className='listItemTitle'>{list.name}</h3>
							<span className='listItemMembers'>
								{list.members.length === 0
									? ''
									: list.members.length === 1
									? ' · 1 member'
									: ` · ${list.members.length} members`}
							</span>
							{!search && (
								<ListPopup list={list} user={user} opened={activePopup} />
							)}
						</div>

						{list.creator._id === user?._id || list?.followers?.length === 0 ? (
							<Link
								className='listItemInfoBottom'
								to={addUser ? false : `/${user?.userId}`}
								onClick={() => addUser && setActiveAddUser(false)}
							>
								<img
									src={
										!list.creator?.profilePicture && !user?.profilePicture
											? PF + 'icon/noAvatar.png'
											: list.creator?.profilePicture
											? PF + 'storage/' + list.creator?.profilePicture
											: PF + 'icon/noAvatar.png'
									}
									alt=''
									className='listItemInfoBottomCreatorAvatar'
								/>
								<p className='listItemInfoBottomUsername'>
									{list.creator.username || user?.username}
								</p>
								<span className='listItemInfoBottomUserId'>
									{list.creator.userId || user?.userId}
								</span>
							</Link>
						) : (
							<div className='listItemInfoBottom'>
								<div className='listItemInfoBottomSomeAva'>
									<img
										src={
											list.followers[0]?.profilePicture
												? PF + 'storage/' + list.followers[0]?.profilePicture
												: PF + 'icon/noAvatar.png'
										}
										alt=''
										className='listItemInfoBottomCreatorAvatar'
									/>
									{list.followers.length === 2 ? (
										<img
											src={
												list.followers[1]?.profilePicture
													? PF + 'storage/' + list.followers[1]?.profilePicture
													: PF + 'icon/noAvatar.png'
											}
											alt=''
											className='listItemInfoBottomCreatorAvatar'
										/>
									) : (
										list.followers.length >= 3 && (
											<>
												<img
													src={
														list.followers[1]?.profilePicture
															? PF +
															  'storage/' +
															  list.followers[1]?.profilePicture
															: PF + 'icon/noAvatar.png'
													}
													alt=''
													className='listItemInfoBottomCreatorAvatar'
												/>
												<img
													src={
														list.followers[2]?.profilePicture
															? PF +
															  'storage/' +
															  list.followers[2]?.profilePicture
															: PF + 'icon/noAvatar.png'
													}
													alt=''
													className='listItemInfoBottomCreatorAvatar'
												/>
											</>
										)
									)}
								</div>

								<span
									className='listItemInfoBottomUserId'
									style={{ left: '0px' }}
								>
									{formatNumber(list.followers.length)} followers including{' '}
									{list.followers.find(following =>
										user.following.includes(following._id)
									)?.userId ||
										list.followers.reduce((maxUser, currentUser) => {
											const maxFollowersCount = maxUser.followers.length || 0
											const currentFollowersCount =
												currentUser.followers.length || 0

											if (currentFollowersCount > maxFollowersCount) {
												return currentUser
											} else {
												return maxUser
											}
										}).followers.length}
								</span>
							</div>
						)}
					</div>
				</div>
				{followBtn &&
					list.followers.some(follower => follower._id !== user._id) && (
						<div
							className='listItemRight'
							onMouseOver={() =>
								setHoverFollowBtn(prev => ({
									...prev,
									hover: true,
								}))
							}
							onMouseOut={() =>
								setHoverFollowBtn(prev => ({
									...prev,
									hover: false,
								}))
							}
							onClick={e => handleFollowClick(e)}
						>
							{hoverFollowBtn.type === 'follow' ? (
								<div className='listItemFollowBtn'>
									<LuPlus fontSize={18} color='#fff' />
								</div>
							) : (
								hoverFollowBtn.type === 'unfollow' && (
									<div className='listItemFollowBtn unfollow'>
										<IoCheckmark
											fontSize={18}
											color={hoverFollowBtn.hover ? '#F4212E' : 'var(--black)'}
										/>
									</div>
								)
							)}
						</div>
					)}
				<div
					className='listItemRight'
					style={{ display: noPin || (followBtn && 'none') }}
				>
					{!addUser ? (
						<div className='listItemPinBlock' onClick={e => pinList(e)}>
							{pinned ? (
								<BsPinFill color={'#1d9bf0'} fontSize={20} />
							) : (
								<BsPin color={'#1d9bf0'} fontSize={20} />
							)}
						</div>
					) : (
						chosenLists.includes(list?._id) && (
							<AiOutlineCheck
								color='var(--blue)'
								style={{ position: 'relative', right: '10px' }}
							/>
						)
					)}
				</div>
			</div>
		</Link>
	)
}

export default ListItem
