// import css, rightbar component, react hook and navigation components

import './settingsMain.css'

import SettingsRightbar from './../settingsRightbar/SettingsRightbar'

import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const SettingsMain = ({ activePage, setActivePage }) => {
	// declaring variable that helps to get images from folder directly without importing

	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	// declaring state of text field

	const [text, setText] = useState('Allow All')

	// declaring location var
	const location = useLocation()

	return (
		<div
			style={{ display: 'flex' }}
			className={activePage === 'addition' ? 'test' : null}
		>
			<div
				className={
					activePage === 'addition'
						? 'settingsMain specialMain'
						: 'settingsMain'
				}
			>
				<h2 className='settingsTitle'>Settings</h2>
				<h1 className='settingsPostTitle'>Privacy</h1>
				{/* 1 block */}
				<Link to='/settings/account/personalization'>
					<div
						className={
							location.pathname === '/settings/account/personalization'
								? 'settingsItem active'
								: 'settingsItem'
						}
					>
						<h3 className='settingsItemTitle'>Personalization and data</h3>
						<img
							className='settingsItemImg'
							src={PF + 'icon/utility/chevronRight.svg'}
							alt=''
						/>
						<span className='settingsItemText'>{text}</span>
					</div>
				</Link>
				{/* 2 block */}
				<Link to='/settings/your_twitter_data'>
					<div
						className={
							location.pathname === '/settings/your_twitter_data'
								? 'settingsItem active'
								: 'settingsItem'
						}
					>
						<h3 className='settingsItemTitle'>Your Twitter data</h3>
						<img
							className='settingsItemImg'
							src={PF + 'icon/utility/chevronRight.svg'}
							alt=''
						/>
					</div>
				</Link>
				<span className='settingsDesc'>
					These settings apply to this browser or device while you’re logged
					out. They don’t have any effect when you’re logged in.
				</span>
				<hr className='settingsHr' />
				<h1 className='settingsPostTitle'>General</h1>
				{/* 3 block */}
				<Link to='/settings/about'>
					<div
						className={
							location.pathname === '/settings/about'
								? 'settingsItem active'
								: 'settingsItem'
						}
					>
						<h3 className='settingsItemTitle'>Additional resources</h3>
						<img
							className='settingsItemImg'
							src={PF + 'icon/utility/chevronRight.svg'}
							alt=''
						/>
					</div>
				</Link>
			</div>
			{/* rightbar component */}
			<SettingsRightbar setText={setText} />
		</div>
	)
}

export default SettingsMain
