import { Link } from 'react-router-dom'
import './pinnedListItem.css'

const PinnedListItem = ({ list }) => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	return (
		<Link to={`/lists/${list._id}`} className='pinnedListItem'>
			<div className='pinnedListItemContainer'>
				<img src={PF + 'storage/' + list?.coverPicture} alt='' />
				<p>{list?.name}</p>
			</div>
		</Link>
	)
}

export default PinnedListItem
