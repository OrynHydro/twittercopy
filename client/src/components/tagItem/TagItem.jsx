import { CiHashtag } from 'react-icons/ci'
import './tagItem.css'

const TagItem = ({ tag, chosenTags, setChosenTags }) => {
	return (
		<div
			className={chosenTags.includes(tag) ? 'profileTag chosen' : 'profileTag'}
			onClick={() =>
				!chosenTags.includes(tag)
					? setChosenTags([...chosenTags, tag])
					: setChosenTags(chosenTags.filter(t => t !== tag))
			}
		>
			<CiHashtag fontSize={20} />
			<span className='profileTagTitle'>{tag}</span>
		</div>
	)
}

export default TagItem
