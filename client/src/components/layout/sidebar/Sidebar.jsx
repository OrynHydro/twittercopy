// import css, navigation components, react hooks, helpers lists and custom hook

import './sidebar.css'

import { Link, useLocation, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
	sidebarUnregistered,
	sidebarRegistered,
	sidebarMore,
} from './../../../helpers/sidebar'
import { useOutsideClick } from '../../../utils/useOutsideClick'

// states of modal windows and user

const Sidebar = ({
	registered,
	activeTwitterBlue,
	setActiveTwitterBlue,
	setActiveLogOut,
	setActiveLoginForm,
	activeVerified,
	setActiveVerified,
	setActiveEdit,
	setActiveProfessionals,
	setIsLoading,
	user,
	userInStorage,
	activeShareModal,
	setActiveShareModal,
}) => {
	// declaring variable that helps to get images from folder directly without importing

	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	// navigation vars

	const location = useLocation()
	const params = useParams()
	const navigate = useNavigate()

	// changes block if registered

	const reqArr = registered ? sidebarRegistered : sidebarUnregistered

	// states of modal blocks

	const [activeModal, setActiveModal] = useState(false)
	const root = useOutsideClick(() => setActiveModal(false))

	const [activeMore, setActiveMore] = useState(false)
	const [activeMoreItem, setActiveMoreItem] = useState(null)
	const moreBlock = useOutsideClick(() => {
		setActiveMore(false)
		setActiveMoreItem(null)
	})

	if (activeVerified && activeMore) setActiveMore(false)

	// loading spinner till user got from local storage

	useEffect(() => {
		userInStorage && user && setIsLoading(false)
	}, [user, userInStorage])

	return (
		<div className='sidebar'>
			<div className='sidebarContainer'>
				<div className='sidebarLogo'>
					<Link to='/'>
						<img src={PF + 'logo/logo.png'} alt='' />
					</Link>
				</div>
				<nav className='sidebarNav'>
					{/* sidebar items one by one */}
					{reqArr.map(item => {
						return (
							// link to different page
							<Link
								to={
									item.link
										? `${item.link}`
										: item.title === 'Profile'
										? `/${user?.userId}`
										: item.title === 'More' && null
								}
								onClick={() =>
									item.title === 'Twitter Blue'
										? setActiveTwitterBlue(true)
										: item.title === 'Verified Organizations'
										? setActiveVerified(true)
										: item.title === 'More'
										? setActiveMore(true)
										: null
								}
								key={item.id}
								style={{ maxWidth: 'fit-content' }}
							>
								{/* the same as link */}
								<div
									className={
										(item.title !== 'Twitter Blue' && activeTwitterBlue) ||
										(item.title !== 'Verified Organizations' &&
											activeVerified) ||
										(params.userId !== user?.userId &&
											location.pathname.match(`${params.userId}`))
											? 'sidebarNavItem'
											: (location.pathname === '/' &&
													item.link === '/explore' &&
													!registered) ||
											  location.pathname === item.link ||
											  (location.pathname.match('notifications') &&
													item.link === '/notifications') ||
											  (location.pathname.match('settings') &&
													item.link === '/settings') ||
											  (params.userId && item.title === 'Profile') ||
											  (item.title === 'Twitter Blue' && activeVerified) ||
											  (item.title === 'Verified Organizations' &&
													activeVerified)
											? 'sidebarNavItem active'
											: 'sidebarNavItem'
									}
								>
									{/* img related to specific block */}
									<img
										src={
											(item.title !== 'Twitter Blue' && activeTwitterBlue) ||
											(item.title !== 'Verified Organizations' &&
												activeVerified) ||
											(params.userId !== user?.userId &&
												location.pathname.match(`${params.userId}`))
												? item.img
												: (location.pathname === '/' &&
														item.link === '/explore') ||
												  location.pathname === item.link ||
												  (location.pathname.match('notifications') &&
														item.link === '/notifications') ||
												  (location.pathname.match('settings') &&
														item.link === '/settings') ||
												  (params.userId && item.title === 'Profile') ||
												  (item.title === 'Twitter Blue' &&
														activeTwitterBlue) ||
												  (item.title === 'Verified Organizations' &&
														activeVerified)
												? item.imgBold
												: item.img
										}
										alt=''
									/>
									<span className='sidebarNavItemText'>{item.title}</span>
								</div>
								{/* dropdown menu */}
								<div
									style={{
										display:
											item.title !== 'More'
												? 'none'
												: activeMore
												? 'flex'
												: null,
									}}
									className={
										activeMore ? 'sidebarMoreBlock active' : 'sidebarMoreBlock'
									}
									ref={moreBlock}
								>
									{sidebarMore.map(item => (
										<div key={item.id}>
											<Link
												to={
													item.title === 'Topics'
														? `/${user?.userId}/topics`
														: item.title === 'Lists'
														? `/${user?.userId}/lists`
														: null
												}
												onClick={() => {
													setActiveMoreItem(
														item.id === activeMoreItem ? null : item.id
													)
													setActiveVerified(
														item.title === 'Verified Orgs' ? true : false
													)
													setActiveEdit(
														item.title === 'Twitter Circle' ? true : false
													)
												}}
											>
												<div
													className={
														item?.items
															? 'sidebarMoreBlockItem containsItems'
															: 'sidebarMoreBlockItem'
													}
												>
													<img
														className='sidebarMoreBlockImg'
														style={{ display: !item?.img ? 'none' : 'flex' }}
														src={item?.img}
														alt=''
													/>
													<span className='sidebarMoreBlockTitle'>
														{item.title}
													</span>
													<svg
														className='sidebarMoreBlockChevron'
														style={{ display: item?.items ? 'block' : 'none' }}
														transform={
															activeMoreItem === item.id
																? 'rotate(-180 0 0)'
																: 'rotate(0 0 0)'
														}
														xmlns='http://www.w3.org/2000/svg'
														width='24'
														height='24'
														viewBox='0 0 24 24'
														fill='none'
														stroke={
															activeMoreItem === item.id ? '#1D9BF0' : '#494E51'
														}
														strokeWidth='2'
														strokeLinecap='round'
														strokeLinejoin='round'
													>
														<polyline points='6 9 12 15 18 9'></polyline>
													</svg>
												</div>
											</Link>
											{item?.items
												? item.items.map(i => (
														<div
															key={i.id}
															className={
																activeMoreItem === item.id
																	? 'sidebarMoreItem active'
																	: 'sidebarMoreItem'
															}
															onClick={() => {
																setActiveProfessionals(
																	i.title === 'Twitter for Professionals'
																		? true
																		: false
																)
															}}
														>
															<img
																className='sidebarMoreItemImg'
																src={i.img}
																alt=''
															/>
															<span className='sidebarMoreItemTitle'>
																{i.title}
															</span>
														</div>
												  ))
												: null}
										</div>
									))}
								</div>
							</Link>
						)
					})}
					{/* user data block in the bottom part */}
					<div
						className={
							registered ? 'sidebarRegisteredBlock' : 'sidebarUnregisteredBlock'
						}
					>
						<button
							className='sidebarRegisteredBtn'
							onClick={() => setActiveShareModal(true)}
						>
							Tweet
						</button>
						<div
							className='sidebarProfileBlock'
							onClick={e => {
								setActiveModal(true)
								e.stopPropagation()
							}}
						>
							<img
								className='sidebarUserImg'
								src={
									user && user?.profilePicture
										? PF + 'storage/' + user?.profilePicture
										: PF + 'icon/noAvatar.png'
								}
								alt=''
							/>
							<div className='sidebarUserData'>
								<span className='sidebarUsername'>
									{user?.username.length > 15
										? user?.username.split('').slice(0, 16).join('') + '...'
										: user?.username}
								</span>
								<p className='sidebarUserId'>{user?.userId}</p>
							</div>
							<img
								className='sidebarMoreImg'
								src={PF + 'icon/utility/moreHorizontal.svg'}
								alt=''
							/>
						</div>
						<div
							ref={root}
							className={activeModal ? 'sidebarModal active' : 'sidebarModal'}
						>
							<ul className='sidebarModalList'>
								<li
									className='sidebarModalItem'
									onClick={() => {
										setActiveLoginForm(true)
										setActiveModal(false)
									}}
								>
									Add an existing account
								</li>
								<li
									className='sidebarModalItem'
									onClick={() => {
										setActiveLogOut(true)
										setActiveModal(false)
									}}
								>
									Log out {user?.userId}
								</li>
							</ul>
							<span className='triangle'>▼</span>
						</div>
					</div>
				</nav>
			</div>
		</div>
	)
}

export default Sidebar
