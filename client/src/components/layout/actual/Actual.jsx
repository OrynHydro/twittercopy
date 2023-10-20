// importing css file, component, react hook and presets file

import './actual.css'
import { Trends } from './../../index'

import { trends } from '../../../helpers/trends'

import { useState } from 'react'

const Actual = ({ registered, position }) => {
	// declaring state for searchbar

	const [active, setActive] = useState(false)

	// declaring variable that helps to get images from folder directly without importing

	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	return (
		<div
			className={registered ? 'actual registered' : 'actual'}
			style={{ left: position ? '15px' : null }}
		>
			<div className='actualSearchBlock'>
				<form
					className='actualSearchBlockForm'
					onFocus={() => setActive(true)}
					onBlur={() => setActive(false)}
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
						placeholder='Search Twitter'
						className={
							active
								? 'actualSearchBlockFormInput active'
								: 'actualSearchBlockFormInput'
						}
					/>
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
			<div className='actualContainer'>
				<h1 className='actualTitle'>Trends for you</h1>
				{trends.map(item => (
					<Trends
						key={item.id}
						preTitle={item.preTitle}
						title={item.title}
						img={item.img}
						imgActive={item.imgActive}
						tweets={item.tweets}
						registered
					/>
				))}
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
