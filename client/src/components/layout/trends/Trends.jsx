// import css and react hook

import './trends.css'

import { useState } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'

const Trends = ({ title, tweets, registered }) => {
	// declaring state of item that can be hovered to change its appearance

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
					<div className='trendsItemTitle'></div>
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
