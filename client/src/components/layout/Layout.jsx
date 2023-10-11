// import './notFound.css'

import {
	Sidebar,
	TwitterBlue,
	LogoutForm,
	LoginForm,
	VerifiedOrganizations,
	TwitterCircle,
	TwitterProfessionals,
} from '../../components/index'
import { useState } from 'react'

const Layout = ({ isLoading, setIsLoading, children, user, userInStorage }) => {
	// declaring states of modal windows

	const [activeTwitterBlue, setActiveTwitterBlue] = useState(false)
	const [activeLogOut, setActiveLogOut] = useState(false)
	const [activeLoginForm, setActiveLoginForm] = useState(false)
	const [activeVerified, setActiveVerified] = useState(false)
	const [activeProfessionals, setActiveProfessionals] = useState(false)

	const [activeEdit, setActiveEdit] = useState(false)
	const [activeEditCircle, setActiveEditCircle] = useState(true)
	const [activeEditRec, setActiveEditRec] = useState(false)
	const [activeEditInput, setActiveEditInput] = useState(false)
	const [hasValue, setHasValue] = useState(false)

	document.title = 'Bookmarks / Twitter'

	// removes scrollbar when modal windows are open

	activeLogOut || activeLoginForm || activeTwitterBlue || activeVerified
		? (document.body.style.overflowY = 'hidden')
		: (document.body.style.overflowY = 'inherit')

	return (
		<div style={{ display: 'flex' }}>
			{/* sidebar with modal windows' states */}

			<Sidebar
				registered
				activeTwitterBlue={activeTwitterBlue}
				setActiveTwitterBlue={setActiveTwitterBlue}
				activeLogOut={activeLogOut}
				setActiveLogOut={setActiveLogOut}
				activeLoginForm={activeLoginForm}
				setActiveLoginForm={setActiveLoginForm}
				activeVerified={activeVerified}
				setActiveVerified={setActiveVerified}
				setActiveEdit={setActiveEdit}
				setActiveProfessionals={setActiveProfessionals}
				isLoading={isLoading}
				setIsLoading={setIsLoading}
				user={user}
				userInStorage={userInStorage}
			/>
			{/* main content in page */}
			<div style={{ display: 'flex' }}>{children}</div>

			{/* modal windows */}
			<TwitterBlue
				active={activeTwitterBlue}
				setActive={setActiveTwitterBlue}
			/>
			<LogoutForm active={activeLogOut} setActive={setActiveLogOut} />
			<LoginForm
				activeForm={activeLoginForm}
				setActiveForm={setActiveLoginForm}
			/>
			<VerifiedOrganizations
				active={activeVerified}
				setActive={setActiveVerified}
			/>
			<TwitterCircle
				activeEdit={activeEdit}
				setActiveEdit={setActiveEdit}
				activeEditCircle={activeEditCircle}
				setActiveEditCircle={setActiveEditCircle}
				activeEditRec={activeEditRec}
				setActiveEditRec={setActiveEditRec}
				activeEditInput={activeEditInput}
				setActiveEditInput={setActiveEditInput}
				hasValue={hasValue}
				setHasValue={setHasValue}
			/>
			<TwitterProfessionals
				active={activeProfessionals}
				setActive={setActiveProfessionals}
			/>
		</div>
	)
}

export default Layout
