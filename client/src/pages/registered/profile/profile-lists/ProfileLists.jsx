// lists pages inside of profile

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useOutsideClick } from '../../../../utils/useOutsideClick'

export const ProfileLists = ({ user, setActiveAddList }) => {
	const [activeLists, setActiveLists] = useState(false)
	const listsBlock = useOutsideClick(() => setActiveLists(false))

	// declaring variable that helps to get images from folder directly without importing

	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	document.title = `Lists created by @${user?.userId}`

	return (
		<div className='profileLists'>
			<div className='profileTop'>
				<div className='profileTopTextBlock'>
					<h2 className='profileTopTitle'>Lists</h2>
					<span className='profileTopTweetsCounter'>{user?.userId}</span>
				</div>
				<div className='profileTopIconBlock'>
					<div
						className='profileTopIcon'
						onClick={() => setActiveAddList(true)}
					>
						<img src={PF + 'icon/sidebarMore/lists.svg'} alt='' />
					</div>
					<div className='profileTopIcon' onClick={() => setActiveLists(true)}>
						<img src={PF + 'icon/utility/moreHorizontal.svg'} alt='' />
					</div>
					<div
						ref={listsBlock}
						className={activeLists ? 'listsBlock active' : 'listsBlock'}
					>
						<Link
							to={`/${user?.userId}/lists/membership`}
							onClick={() => setActiveLists(false)}
						>
							<img src={PF + 'icon/sidebarMore/lists.svg'} alt='' />
							Lists you’re on
						</Link>
					</div>
				</div>
			</div>
			<div className='profileListsMain'>
				<div className='profileListsTextContainer'>
					<h1 className='profileListsTitle'>Pinned Lists</h1>
					<p className='profileListsText'>
						Nothing to see here yet — pin your favorite Lists to access them
						quickly.
					</p>
				</div>
				<hr className='settingsHr' />
				<div className='profileListsTextContainer'>
					<h1 className='profileListsTitle'>Your Lists</h1>
					<p className='profileListsText'>
						You haven't created or followed any Lists. When you do, they'll show
						up here.
					</p>
				</div>
			</div>
		</div>
	)
}
