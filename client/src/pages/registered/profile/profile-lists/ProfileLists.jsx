// lists pages inside of profile

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useOutsideClick } from '../../../../utils/useOutsideClick'
import axios from 'axios'
import { BsPin } from 'react-icons/bs'

export const ProfileLists = ({ user, setActiveAddList }) => {
	const [activeLists, setActiveLists] = useState(false)
	const listsBlock = useOutsideClick(() => setActiveLists(false))

	// declaring variable that helps to get images from folder directly without importing

	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	document.title = `Lists created by ${user?.userId}`

	const [userLists, setUserLists] = useState([])

	useEffect(() => {
		const fetchUserLists = async () => {
			await axios
				.get(`/lists/userLists/${user?._id}`)
				.then(res =>
					setUserLists(
						res.data[0].createdLists?.concat(res.data[0].followedLists)
					)
				)
		}
		userLists.length === 0 && fetchUserLists()
	}, [userLists.length])

	console.log(userLists)

	const formatNumber = number => {
		if (number >= 1000000) {
			return (number / 1000000).toFixed(1) + 'M'
		} else if (number >= 1000) {
			return (number / 1000).toFixed(1) + 'K'
		} else {
			return number.toString()
		}
	}

	return (
		<div className='profileLists'>
			<div className='profileTop'>
				<div className='profileTopTextBlock'>
					<h2 className='profileTopTitle'>Lists</h2>
					<span className='profileTopTweetsCounter'>{user?.userId}</span>
				</div>
				<div className='profileTopIconBlock'>
					<div
						className='profileTopIcon'
						onClick={() => setActiveAddList(true)}
					>
						<img src={PF + 'icon/sidebarMore/lists.svg'} alt='' />
					</div>
					<div className='profileTopIcon' onClick={() => setActiveLists(true)}>
						<img src={PF + 'icon/utility/moreHorizontal.svg'} alt='' />
					</div>
					<div
						ref={listsBlock}
						className={activeLists ? 'listsBlock active' : 'listsBlock'}
					>
						<Link
							to={`/${user?.userId}/lists/membership`}
							onClick={() => setActiveLists(false)}
						>
							<img src={PF + 'icon/sidebarMore/lists.svg'} alt='' />
							Lists you’re on
						</Link>
					</div>
				</div>
			</div>
			<div className='profileListsMain'>
				<div className='profileListsTextContainer'>
					<h1 className='profileListsTitle'>Pinned Lists</h1>
					<p className='profileListsText'>
						Nothing to see here yet — pin your favorite Lists to access them
						quickly.
					</p>
				</div>
				<hr className='settingsHr' />
				<div className='profileListsTextContainer'>
					<h1 className='profileListsTitle'>Your Lists</h1>
					{userLists.length === 0 ? (
						<p className='profileListsText'>
							You haven't created or followed any Lists. When you do, they'll
							show up here.
						</p>
					) : (
						userLists.map((list, index) => (
							<Link className='listItem' key={index}>
								<div className='listItemContainer'>
									<div className='listItemLeft'>
										<img
											src={PF + 'defaultListCover.png'}
											alt=''
											className='listItemImg'
										/>
										<div className='listItemInfo'>
											<div className='listItemInfoTop'>
												<h3 className='listItemTitle'>{list.name}</h3>
												<span className='listItemMembers'>
													{list.members.length === 0
														? ''
														: list.members.length === 1
														? ' · 1 member'
														: ` · ${list.members.length} members`}
												</span>
											</div>

											{list.creator === user?._id ? (
												<div className='listItemInfoBottom'>
													<img
														src={PF + 'storage/' + user.profilePicture}
														alt=''
														className='listItemInfoBottomCreatorAvatar'
													/>
													<p className='listItemInfoBottomUsername'>
														{user.username}
													</p>
													<span className='listItemInfoBottomUserId'>
														{user.userId}
													</span>
												</div>
											) : (
												<div className='listItemInfoBottom'>
													<div className='listItemInfoBottomSomeAva'>
														<img
															src={
																PF +
																'storage/' +
																list.followers[0].profilePicture
															}
															alt=''
															className='listItemInfoBottomCreatorAvatar'
														/>
														<img
															src={
																PF +
																'storage/' +
																list.followers[1].profilePicture
															}
															alt=''
															className='listItemInfoBottomCreatorAvatar'
														/>
														<img
															src={
																PF +
																'storage/' +
																list.followers[2].profilePicture
															}
															alt=''
															className='listItemInfoBottomCreatorAvatar'
														/>
													</div>

													<span
														className='listItemInfoBottomUserId'
														style={{ left: '0px' }}
													>
														{formatNumber(list.followers.length)} followers
														including{' '}
														{list.followers.find(following =>
															user.following.includes(following._id)
														)?.userId ||
															list.followers.reduce((maxUser, currentUser) => {
																const maxFollowersCount =
																	maxUser.followers.length || 0
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
									<div className='listItemRight'>
										<div className='listItemPinBlock'>
											<BsPin color={'#1d9bf0'} fontSize={20} />
										</div>
									</div>
								</div>
							</Link>
						))
					)}
				</div>
			</div>
		</div>
	)
}
