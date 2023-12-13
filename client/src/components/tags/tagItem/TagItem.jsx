import { CiHashtag } from 'react-icons/ci'
import './tagItem.css'

const TagItem = ({ tag, chosenTags, setChosenTags, postPage }) => {
	return (
		<div
			className={
				postPage
					? 'profileTag postPage'
					: chosenTags?.includes(tag)
					? 'profileTag chosen'
					: 'profileTag'
			}
			onClick={() => {
				if (postPage) {
					return
				}
				!chosenTags.includes(tag)
					? setChosenTags([...chosenTags, tag])
					: setChosenTags(chosenTags.filter(t => t !== tag))
			}}
		>
			<CiHashtag fontSize={20} />
			<span className='profileTagTitle'>{tag}</span>
		</div>
	)
}

export default TagItem
