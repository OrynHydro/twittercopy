// importing css file, component, react hook and presets file

import './actual.css'
import { Trends } from './../../index'

import { useEffect, useState } from 'react'
import { useOutsideClick } from '../../../utils/useOutsideClick'
import axios from 'axios'
import UserItem from '../../user/userItem/UserItem'
import { GoXCircleFill } from 'react-icons/go'
import { Link, useNavigate } from 'react-router-dom'

const Actual = ({ registered, position, user, noSearch }) => {
	// declaring state for searchbar

	const [active, setActive] = useState(false)

	// declaring variable that helps to get images from folder directly without importing

	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	const searchPopup = useOutsideClick(() => setActive(false))

	const [text, setText] = useState('')

	const [isSearching, setIsSearching] = useState(false)

	const [searchResults, setSearchResults] = useState([])

	const [isLoading, setIsLoading] = useState(false)

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

	const [trendTags, setTrendTags] = useState([])

	const fetchTrendTags = async () => {
		setIsLoading(true)
		try {
			const res = await axios.get('/users/trendTags')
			setTrendTags(res.data)
		} catch (error) {
			console.log(error)
		}
		setIsLoading(false)
	}

	useEffect(() => {
		fetchTrendTags()
	}, [])

	const navigate = useNavigate()

	const handleKeyDown = e => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			navigate('/search?q=' + text)
		}
	}

	return (
		<div
			className={registered ? 'actual registered' : 'actual'}
			style={{ left: position ? '15px' : null }}
		>
			{!noSearch && (
				<div className='actualSearchBlock'>
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
								className={
									registered ? 'crossCircle registered' : 'crossCircle'
								}
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
									: text.length > 0 && Array.isArray(searchResults) && active
									? 'actualSearchPopup active'
									: 'actualSearchPopup noText'
							}
							style={{ left: registered ? '-20px' : null }}
						>
							{isSearching ? (
								<div className='loader'></div>
							) : searchResults === 'No matches' && registered ? (
								<p>No matches for "{text}"</p>
							) : searchResults === 'No matches' && !registered ? (
								<Link to={'/search?q=' + text} className='searchFor'>
									Search for "{text}"
								</Link>
							) : searchResults.length > 0 ? (
								searchResults.map((item, index) => (
									<>
										{!registered && (
											<Link to={'/search?q=' + text} className='searchFor'>
												Search for "{text}"
											</Link>
										)}
										<UserItem key={index} item={item} isLink user={user} />
									</>
								))
							) : (
								<p>Try searching for people, lists, or keywords</p>
							)}
						</div>
					</form>
					<div
						className='actualSettingsBlock'
						title='Settings'
						style={{ display: registered ? 'none' : null }}
					>
						<img
							className='actualSettingsImg'
							src={PF + 'icon/common/settings.svg'}
							alt=''
						/>
					</div>
				</div>
			)}

			<div className='actualContainer'>
				<h1 className='actualTitle'>Trends for you</h1>
				{isLoading ? (
					<div className='loader'></div>
				) : (
					trendTags.map((item, index) => (
						<Trends
							key={index}
							title={item.tag}
							tweets={item.count}
							registered
						/>
					))
				)}
				<div
					className={
						registered
							? 'trendsItem showMore registered'
							: 'trendsItem showMore'
					}
				>
					Show more
				</div>
			</div>
		</div>
	)
}

export default Actual
