import { useState } from 'react'
import './NewMessage.css'

const NewMessage = ({ activeModal, setActiveModal }) => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER
	const [activeSearch, setActiveSearch] = useState(false)
	return (
		<div className={activeModal ? 'newMessageModal active' : 'newMessageModal'}>
			<div className='newMessageModalBlock'>
				<div className='newMessageModalTop'>
					<div className='newMessageModalTopLeft'>
						<div
							className='newMessageModalCross'
							title='Close'
							onClick={() => setActiveModal(false)}
						>
							<img src={PF + 'icon/utility/x.svg'} alt='' />
						</div>
						<h1>New message</h1>
					</div>

					<button className='newMessageModalTopRight'>Next</button>
				</div>
				<div className='newMessageModalSearchBlock'>
					<div className='newMessageModalSearch'>
						<img
							src={
								activeSearch
									? PF + 'icon/utility/searchActive.svg'
									: PF + 'icon/utility/search.svg'
							}
							alt=''
						/>
						<input
							type='text'
							onFocus={() => setActiveSearch(true)}
							onBlur={() => setActiveSearch(false)}
							placeholder='Search people'
						/>
					</div>
					<hr className='newMessageModalHr' />
				</div>
			</div>
			<div className='overlay' onClick={() => setActiveModal(false)}></div>
		</div>
	)
}

export default NewMessage
