export const ProfileListsMembership = ({ user }) => {
	document.title = `List membership for @${user?.userId}`
	return (
		<div className='profileListsMembership'>
			<div className='profileTop'>
				<h2 className='profileTopTitle'>Lists you’re on</h2>
				<span className='profileTopTweetsCounter'>{user?.userId}</span>
			</div>
			<div className='profileTopicsMain'>
				<h1 className='profileTopicsMainTitle'>
					You haven’t been added to any Lists yet
				</h1>
				<span className='profileTopicsText'>
					When someone adds you to a List, it’ll show up here.
				</span>
			</div>
		</div>
	)
}
