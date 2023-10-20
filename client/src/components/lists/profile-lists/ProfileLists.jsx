// lists pages inside of profile

import './../lists.css'

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useOutsideClick } from '../../../utils/useOutsideClick'
import axios from 'axios'
import { BsFillXCircleFill, BsPin } from 'react-icons/bs'
import { PostsLoader } from '../../index'
import ListItem from '../listItem/ListItem'
import PinnedListItem from '../pinnedListItem/PinnedListItem'

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
						res.data.createdLists?.length === 0 &&
							res.data.followedLists?.length === 0
							? undefined
							: res.data.createdLists?.concat(res.data.followedLists)
					)
				)
				.catch(() => setUserLists(undefined))
			setIsLoadingLists(false)
		}
		userLists?.length === 0 && fetchUserLists()
	}, [userLists?.length])

	const [activeSearch, setActiveSearch] = useState(false)

	const [searchText, setSearchText] = useState('')

	const [fetchedLists, setFetchedLists] = useState([])

	const [noMatches, setNoMatches] = useState(false)

	const searchListBlock = useOutsideClick(() => setActiveSearch(false))

	useEffect(() => {
		const searchForList = async text => {
			await axios.get(`/lists/findByText?text=${text}`).then(res => {
				if (res.data === 'No matches') {
					setNoMatches(true)
				} else {
					setFetchedLists(res.data)
					setNoMatches(false)
				}
			})
		}

		searchText ? searchForList(searchText) : setFetchedLists([])
	}, [searchText])

	return (
		<div className='profileLists'>
			<div className='profileTop'>
				<form
					className='actualSearchBlockForm'
					onFocus={() => setActiveSearch(true)}
					// onBlur={() => setActiveSearch(false)}
					ref={searchListBlock}
				>
					<img
						src={
							activeSearch
								? PF + 'icon/utility/searchActive.svg'
								: PF + 'icon/utility/search.svg'
						}
						alt=''
						className='searchIcon'
					/>
					<input
						placeholder='Search Lists'
						className={
							activeSearch
								? 'actualSearchBlockFormInput active'
								: 'actualSearchBlockFormInput'
						}
						onChange={e => setSearchText(e.target.value)}
						value={searchText}
					/>
					<BsFillXCircleFill
						className='xCircle'
						onClick={() => setSearchText('')}
						style={{ display: searchText && activeSearch ? 'block' : 'none' }}
						fontSize={24}
						color='var(--blue)'
					/>
					{activeSearch && (
						<div
							className='listSearchBlock'
							style={{ minHeight: fetchedLists.length === 1 && 'fit-content' }}
						>
							{!searchText ? (
								<div className='listSearchContainer'>
									Try searching for lists
								</div>
							) : fetchedLists.length !== 0 && !noMatches ? (
								fetchedLists.map((list, index) => (
									<ListItem search list={list} key={index} user={user} noPin />
								))
							) : (
								searchText &&
								noMatches && (
									<div className='listSearchContainer'>
										No Lists matched "{searchText}"
									</div>
								)
							)}
						</div>
					)}
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
				<h1 className='profileListsTitle'>Pinned Lists</h1>
				{user?.pinnedLists.length > 0 ? (
					<div className='pinnedListsBlock'>
						{user?.pinnedLists.map((item, index) => (
							<PinnedListItem list={item} key={index} user={user} />
						))}
					</div>
				) : (
					<p className='profileListsText'>
						Nothing to see here yet — pin your favorite Lists to access them
						quickly.
					</p>
				)}
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
