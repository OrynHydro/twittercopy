// importing css file for this page, specific components and react hook

import { Sidebar, UnregisteredBlock } from '../../../components'
import './settings.css'

import { useState } from 'react'
import SettingsMain from './settingsMain/SettingsMain'

const Settings = () => {
	const [activePage, setActivePage] = useState('personalization')
	return (
		// settings page, wrapped by flexible div

		<div style={{ display: 'flex' }}>
			<Sidebar />
			<SettingsMain activePage={activePage} setActivePage={setActivePage} />
			<UnregisteredBlock activePage={activePage} />
		</div>
	)
}

export default Settings
