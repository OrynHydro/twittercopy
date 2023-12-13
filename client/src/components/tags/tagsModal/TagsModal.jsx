import { RxCross2 } from 'react-icons/rx'
import { tags } from '../../../helpers/tags'
import TagItem from '../tagItem/TagItem'
import './tagsModal.css'
import { FaArrowLeft } from 'react-icons/fa6'

const TagsModal = ({
	active,
	setActive,
	chosenTags,
	setChosenTags,
	isShareModal,
	setActiveShareModal,
}) => {
	return (
		<div
			className={
				isShareModal && active
					? 'shareTagsModal active tagsModalShare'
					: active
					? 'shareTagsModal active'
					: 'shareTagsModal'
			}
		>
			<div className='shareTagsModalBlock'>
				<div className='shareTagsModalContainer'>
					<div className='shareTagsModalTop'>
						{isShareModal && (
							<div
								className='shareTagsModalBack'
								onClick={() => {
									setActive(false)
									setActiveShareModal(true)
								}}
							>
								<FaArrowLeft fontSize={20} />
							</div>
						)}

						<h1 className='shareTagsModalTitle'>Choose tags for your tweet</h1>
						<div
							className='shareTagsModalCrossBlock'
							onClick={() => setActive(false)}
						>
							<RxCross2 fontSize={20} strokeWidth={0.5} />
						</div>
					</div>
					<div className='profileTagsList'>
						{tags.map((tag, index) => (
							<TagItem
								key={index}
								tag={tag}
								chosenTags={chosenTags}
								setChosenTags={setChosenTags}
							/>
						))}
					</div>
					<div className='shareTagsModalBtn' onClick={() => setActive(false)}>
						Confirm
					</div>
				</div>
			</div>
			<div className='overlay' onClick={() => setActive(false)} />
		</div>
	)
}

export default TagsModal
