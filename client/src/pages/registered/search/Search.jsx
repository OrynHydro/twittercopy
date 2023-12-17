import './search.css'

import { useContext, useEffect, useState } from 'react'
import {
	Actual,
	Layout,
	Posts,
	PostsLoader,
	WhoToFollow,
} from '../../../components'
import { UserContext } from '../../../context/UserContext'
import { useLocalStorage } from '../../../utils/useLocalStorage'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom'
import UserItem from '../../../components/user/userItem/UserItem'
import { GoXCircleFill } from 'react-icons/go'
import { useOutsideClick } from '../../../utils/useOutsideClick'
import { UserFollowItem } from '../../../components/user/userFollowItem/FollowItem'
import { useNavigate } from 'react-router-dom'

const Search = ({ isLoading, setIsLoading }) => {
	// declaring states of modal windows

	document.title = 'Bookmarks / Twitter'

	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	// user data states

	const { user, setUser } = useContext(UserContext)
	const [userInStorage, setUserInStorage] = useLocalStorage('user')

	const [searchParams, setSearchParams] = useSearchParams()

	// fetches user from local storage

	useEffect(() => {
		const fetchUser = async () => {
			const findUser = await axios.get(`/users/findByToken/${userInStorage}`)
			setUser(findUser.data)
		}
		!user && fetchUser()
	}, [user, userInStorage])

	const searchPopup = useOutsideClick(() => setActive(false))

	const [text, setText] = useState('')

	const [isSearching, setIsSearching] = useState(false)

	const [searchResults, setSearchResults] = useState([])

	const handleInputChange = async e => {
		setIsSearching(true)
		const searchText = e.target.value

		setText(searchText)

		setSearchResults([])

		try {
			const res = await axios.get(
				`/users/findByText/${user?._id}?text=${searchText}`
			)
			setSearchResults(res.data)
		} catch (error) {
			console.log(error)
		}

		setIsSearching(false)
	}

	const handleKeyDown = e => {
		if (e.key === 'Enter' && !e.shiftKey && text.length > 0) {
			e.preventDefault()
			setSearchParams({ q: text })
			fetchSearchResults(activeSwitchItem)
			setActive(false)
		}
	}

	const [active, setActive] = useState(false)

	const handleSearchForClick = () => {
		setSearchParams({ q: text })
		fetchSearchResults(activeSwitchItem)
		setActive(false)
	}

	const navigate = useNavigate()

	const [activeSwitchItem, setActiveSwitchItem] = useState('latest')

	const [isFetching, setIsFetching] = useState(false)

	const [searchPageResults, setSearchPageResults] = useState([])

	const fetchSearchResults = async switchItem => {
		setIsFetching(true)
		setSearchPageResults([])
		try {
			if (switchItem === 'latest') {
				await axios
					.get(`/posts/search/latest?text=${searchParams.get('q')}`)
					.then(res => setSearchPageResults(res.data))
			} else if (switchItem === 'people') {
				await axios
					.get(`/users/findByText/${user._id}?text=${searchParams.get('q')}`)
					.then(res => setSearchPageResults(res.data))
			} else if (switchItem === 'media') {
				await axios
					.get(`/posts/search/media?text=${searchParams.get('q')}`)
					.then(res => setSearchPageResults(res.data))
			} else if (switchItem === 'media') {
			} else if (switchItem === 'lists') {
				await axios
					.get(`/lists/findByText?text=${searchParams.get('q')}`)
					.then(res => setSearchPageResults(res.data))
			}
		} catch (error) {
			console.log(error)
		}
		setIsFetching(false)
	}

	useEffect(() => {
		if (!searchParams.get('q')) {
			navigate('/explore')
		}
		setText(searchParams.get('q'))
		fetchSearchResults(activeSwitchItem)
	}, [])

	return (
		<Layout
			isLoading={isLoading}
			setIsLoading={setIsLoading}
			user={user}
			userInStorage={userInStorage}
		>
			<div className='connect'>
				<form
					className='actualSearchBlockForm'
					onFocus={() => setActive(true)}
					ref={searchPopup}
				>
					<img
						src={
							active
								? PF + 'icon/utility/searchActive.svg'
								: PF + 'icon/utility/search.svg'
						}
						alt=''
						className='searchIcon'
					/>
					<input
						placeholder='Search'
						className={
							active
								? 'actualSearchBlockFormInput active'
								: 'actualSearchBlockFormInput'
						}
						onChange={e => handleInputChange(e)}
						onKeyDown={handleKeyDown}
						value={text}
					/>

					{active && (
						<GoXCircleFill
							className={'crossCircle'}
							onClick={() => {
								setText('')
								setSearchResults([])
							}}
							style={{ display: text ? 'block' : 'none' }}
							fontSize={22}
							color='var(--blue)'
						/>
					)}

					<div
						className={
							(text.length === 0 || searchResults === 'No matches') && active
								? 'actualSearchPopup active noText'
								: text.length > 0 && searchResults.length > 0 && active
								? 'actualSearchPopup active'
								: 'actualSearchPopup noText'
						}
					>
						{isSearching ? (
							<div className='loader'></div>
						) : searchResults === 'No matches' ? (
							<>
								<div
									onClick={() => handleSearchForClick()}
									className='searchFor'
								>
									Search for "{text}"
								</div>
							</>
						) : searchResults.length > 0 ? (
							searchResults.map((item, index) => (
								<>
									<div
										onClick={() => handleSearchForClick()}
										className='searchFor'
									>
										Search for "{text}"
									</div>
									<UserItem key={index} item={item} isLink user={user} />
								</>
							))
						) : (
							<p>Try searching for people, lists, or keywords</p>
						)}
					</div>
				</form>
				<div className='searchSwitch'>
					<div
						className={
							activeSwitchItem === 'latest'
								? 'searchSwitchItem active'
								: 'searchSwitchItem'
						}
						onClick={() => {
							setActiveSwitchItem('latest')
							fetchSearchResults('latest')
						}}
					>
						Latest
					</div>
					<div
						className={
							activeSwitchItem === 'people'
								? 'searchSwitchItem active'
								: 'searchSwitchItem'
						}
						onClick={() => {
							setActiveSwitchItem('people')
							fetchSearchResults('people')
						}}
					>
						People
					</div>
					<div
						className={
							activeSwitchItem === 'media'
								? 'searchSwitchItem active'
								: 'searchSwitchItem'
						}
						onClick={() => {
							setActiveSwitchItem('media')
							fetchSearchResults('media')
						}}
					>
						Media
					</div>
					<div
						className={
							activeSwitchItem === 'lists'
								? 'searchSwitchItem active'
								: 'searchSwitchItem'
						}
						onClick={() => {
							setActiveSwitchItem('lists')
							fetchSearchResults('lists')
						}}
					>
						Lists
					</div>
				</div>
				<div className='searchMain'>
					{isFetching ? (
						<PostsLoader />
					) : searchPageResults === 'No matches' ? (
						<div className='noMatches'>
							<h1>No results for "{searchParams.get('q')}"</h1>
							<p>Try searching for something else</p>
						</div>
					) : activeSwitchItem === 'latest' || activeSwitchItem === 'media' ? (
						searchPageResults.map((post, index) => (
							<Posts
								key={index}
								post={post}
								more={PF + 'icon/utility/moreHorizontal.svg'}
								moreActive={PF + 'icon/utility/moreHorizontalActive.svg'}
								currentUser={user}
								isUserPosts={post.user._id === user?._id ? true : false}
							/>
						))
					) : (
						activeSwitchItem === 'people' &&
						searchPageResults.map((item, index) => (
							<UserFollowItem item={item} key={index} currentUser={user} />
						))
					)}
				</div>
			</div>
			{/* rightbar with trends */}
			<div>
				<Actual registered user={user} noSearch />
				<WhoToFollow user={user} />
			</div>
		</Layout>
	)
}

export default Search
