// import css, footer component and object of arrays

import './whoToFollow.css'

import { Footer } from './../../index'
import { whoToFollowItems } from './../../../helpers/whoToFollow'

const WhoToFollow = ({ maxWidth }) => {
	return (
		<div
			className='whoToFollow'
			style={{ maxWidth: maxWidth ? '340px' : '350px' }}
		>
			<div className='whoToFollowBlock'>
				<h1 className='whoToFollowTitle'>Who to follow</h1>
				{/* preset for different users */}
				{whoToFollowItems.map(item => (
					<div className='whoToFollowItem' key={item.id}>
						<div className='whoToFollowImgBlock'>
							<img className='whoToFollowUserImg' src={item.img} />
							<div className='imgBlockOverlay'></div>
						</div>
						<div className='whoToFollowUserData'>
							<span className='whoToFollowUsername'>{item.username}</span>
							<p className='whoToFollowUserId'>{item.userId}</p>
						</div>
						<button className='followBtn'>Follow</button>
					</div>
				))}
				<div className='showMoreBlock'>Show more</div>
			</div>
			<Footer />
		</div>
	)
}

export default WhoToFollow
