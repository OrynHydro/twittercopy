// import css and react hook

import './trends.css'

import { useState } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'

const Trends = ({ title, tweets, registered }) => {
	// declaring state of item that can be hovered to change its appearance

	const [hover, setHover] = useState(false)

	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	const img = PF + 'icon/utility/moreHorizontal.svg'

	const imgActive = PF + 'icon/utility/moreHorizontalActive.svg'

	function formatNumber(number) {
		if (number < 1000) {
			return number
		} else if (number < 1000000) {
			return moment(number).format('0.0K')
		} else {
			return moment(number).format('0.0M')
		}
	}

	return (
		<>
			<Link
				to={'/search?q=' + title}
				className={registered ? 'trends registered' : 'trends'}
			>
				<div className='trendsItem'>
					<div className='trendsItemTitle'>
						<div
							title='More'
							className='trendsMoreBlock'
							onMouseOver={() => setHover(true)}
							onMouseOut={() => setHover(false)}
						>
							<img
								src={hover ? imgActive : img}
								alt=''
								className='trendsMoreImg'
							/>
						</div>
					</div>
					<h2 className='trendsTitle'>
						{title.charAt(0).toUpperCase() + title.slice(1)}
					</h2>
					<span className='trendsTwittsCounter'>
						{formatNumber(tweets)} Tweets
					</span>
				</div>
			</Link>
		</>
	)
}

export default Trends
