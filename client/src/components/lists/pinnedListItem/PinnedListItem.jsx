import { Link } from 'react-router-dom'
import './pinnedListItem.css'
import { useState } from 'react'
import ListPopup from '../listPopup/ListPopup'

const PinnedListItem = ({ list, user }) => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	const [activePopup, setActivePopup] = useState(false)

	return (
		<Link
			to={`/lists/${list._id}`}
			className='pinnedListItem'
			onMouseOver={() => setTimeout(() => setActivePopup(true), 500)}
			onMouseOut={() => setTimeout(() => setActivePopup(false), 500)}
		>
			<div className='pinnedListItemContainer'>
				<img src={PF + 'storage/' + list?.coverPicture} alt='' />
				<p>{list?.name}</p>
			</div>{' '}
			<ListPopup list={list} user={user} opened={activePopup} pinnedItem />
		</Link>
	)
}

export default PinnedListItem
