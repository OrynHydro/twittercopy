import { Link } from 'react-router-dom'

export const ProfileTopics = ({ user }) => {
	document.title = 'Topics / Twitter'
	return (
		<div className='profileTopics'>
			<div className='profileTopicsTop'>
				<h1 className='profileTopicsTitle'>Topics</h1>
				<div className='profileTopicsSwitch'>
					<div className='profileTopicsSwitchItem active'>Followed</div>
					<div className='profileTopicsSwitchItem'>
						<Link to={`/${user?.userId}/topics/not_interested`}>
							Not Interested
						</Link>
					</div>
				</div>
			</div>
			<div className='profileTopicsContentBlock'>
				<span className='profileTopicsText'>
					The Topics you follow are used to personalize the Tweets, events, and
					ads that you see, and show up publicly on your profile
				</span>
			</div>
			<hr className='settingsHr' />
			<div className='profileTopicsContentBlock'>
				<span className='profileTopicsText'>
					Topics that you follow are shown here. To see all the things that
					Twitter thinks you’re interested in, check out{' '}
					<Link>Your Twitter data.</Link> You can also <Link>learn more</Link>{' '}
					about following Topics.
				</span>
			</div>
		</div>
	)
}
