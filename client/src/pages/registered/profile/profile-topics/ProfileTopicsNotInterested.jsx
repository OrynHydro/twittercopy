// topics pages inside of profile

import { Link } from 'react-router-dom'

export const ProfileTopicsNotInterested = ({ user }) => {
	document.title = 'Topics / Twitter'
	return (
		<div className='profileTopics'>
			<div className='profileTopicsTop'>
				<h1 className='profileTopicsTitle'>Topics</h1>
				<div className='profileTopicsSwitch'>
					<div className='profileTopicsSwitchItem'>
						<Link to={`/${user?.userId}/topics/followed`}>Followed</Link>
					</div>
					<div className='profileTopicsSwitchItem active'>Not Interested</div>
				</div>
			</div>
			<div className='profileTopicsMain'>
				<h1 className='profileTopicsMainTitle'>No interest? No problem.</h1>
				<span className='profileTopicsText'>
					When you tell us you're not interested in a Topic, it will show up
					here. We won't recommend Tweets, events, or ads related to Topics you
					aren't into.
				</span>
			</div>
		</div>
	)
}
