// lists pages inside of profile

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useOutsideClick } from '../../../../utils/useOutsideClick'
import axios from 'axios'
import { BsPin } from 'react-icons/bs'
import { PostsLoader } from './../../../../components/index'
import ListItem from '../listItem/ListItem'

export const ProfileLists = ({ user, setActiveAddList }) => {
	const [activeLists, setActiveLists] = useState(false)
	const listsBlock = useOutsideClick(() => setActiveLists(false))

	// declaring variable that helps to get images from folder directly without importing

	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	document.title = `Lists created by ${user?.userId}`

	const [userLists, setUserLists] = useState([])

	const [isLoadingLists, setIsLoadingLists] = useState(true)

	useEffect(() => {
		// setIsLoadingLists(true)
		const fetchUserLists = async () => {
			await axios
				.get(`/lists/userLists/${user?._id}`)
				.then(res =>
					setUserLists(
						res.data[0].createdLists?.concat(res.data[0].followedLists)
					)
				)
				.catch(() => setUserLists(undefined))
			setIsLoadingLists(false)
		}
		userLists?.length === 0 && fetchUserLists()
	}, [userLists?.length])

	const [activeInputEdit, setActiveInputEdit] = useState(false)

	return (
		<div className='profileLists'>
			<div className='profileTop'>
				<form
					className='actualSearchBlockForm'
					onFocus={() => setActiveInputEdit(true)}
					onBlur={() => setActiveInputEdit(false)}
				>
					<img
						src={
							activeInputEdit
								? PF + 'icon/utility/searchActive.svg'
								: PF + 'icon/utility/search.svg'
						}
						alt=''
					/>
					<input
						placeholder='Search Lists'
						className={
							activeInputEdit
								? 'actualSearchBlockFormInput active'
								: 'actualSearchBlockFormInput'
						}
					/>
				</form>

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
					{userLists === undefined ? (
						<p className='profileListsText'>
							You haven't created or followed any Lists. When you do, they'll
							show up here.
						</p>
					) : isLoadingLists ? (
						<PostsLoader />
					) : (
						userLists.map((list, index) => (
							<ListItem list={list} key={index} user={user} />
						))
					)}
				</div>
			</div>
		</div>
	)
}
