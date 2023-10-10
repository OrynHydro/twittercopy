// importing browser router's components to navigate in website

import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom'

// importing css that works in every component

import './css/reset.css'
import './css/main.css'

// importing pages

import {
	Explore,
	Settings,
	Home,
	ExploreReg,
	Notifications,
	Messages,
	Bookmarks,
	Profile,
	NotFound,
} from './pages/index'

// importing custom hook

import ScrollToTop from './utils/scrollToTop'

// importing react hooks

import { useState, useMemo, useEffect } from 'react'

// importing context of user, when authentificated

import { UserContext } from './context/UserContext'

// importing localStorage hook, that helps to save data in user's browser storage

import { useLocalStorage } from './utils/useLocalStorage'

// importing loading screen

import { Loading } from './components'

// App function

function App() {
	// user state declaration

	const [user, setUser] = useState(null)
	const [userInStorage, setUserInStorage] = useLocalStorage('user')

	const value = useMemo(() => ({ user, setUser }), [user, setUser])

	// loading state declaration

	const [isLoading, setIsLoading] = useState(true)

	// user data adding to local storage

	useEffect(() => {
		if (!userInStorage) {
			setUserInStorage(user?.token ? user?.token : null)
		}
	}, [user])

	return (
		// wrapper user context component

		<UserContext.Provider value={value}>
			{/* navigation router */}

			<Router>
				{/* scrolling page to 0.0 coordinates when user redirects to a new page */}

				<ScrollToTop />
				{!userInStorage ? (
					// page navigation

					<Routes>
						{/* Unegistered */}
						<Route
							path='/'
							element={
								<Explore isLoading={isLoading} setIsLoading={setIsLoading} />
							}
						/>
						<Route
							path='/explore'
							element={
								<Explore isLoading={isLoading} setIsLoading={setIsLoading} />
							}
						/>
						<Route
							path='/settings/*'
							element={
								<Settings isLoading={isLoading} setIsLoading={setIsLoading} />
							}
						/>
					</Routes>
				) : (
					<>
						{/* if the page is loading adding loading screen */}

						{isLoading && <Loading />}

						{/* page navigation */}

						<Routes>
							{/* Registered */}
							<Route
								path='/'
								element={
									<Home isLoading={isLoading} setIsLoading={setIsLoading} />
								}
							/>
							<Route
								path='/explore'
								element={
									<ExploreReg
										isLoading={isLoading}
										setIsLoading={setIsLoading}
									/>
								}
							/>
							<Route
								path='/notifications/*'
								element={
									<Notifications
										isLoading={isLoading}
										setIsLoading={setIsLoading}
									/>
								}
							/>
							<Route
								path='/messages'
								element={
									<Messages isLoading={isLoading} setIsLoading={setIsLoading} />
								}
							/>
							<Route
								path='/bookmarks'
								element={
									<Bookmarks
										isLoading={isLoading}
										setIsLoading={setIsLoading}
									/>
								}
							/>
							<Route
								path='/:userId/*'
								element={
									<Profile isLoading={isLoading} setIsLoading={setIsLoading} />
								}
							/>
							<Route
								path='/404'
								element={
									<NotFound isLoading={isLoading} setIsLoading={setIsLoading} />
								}
							/>
							<Route path='*' element={<Navigate to='/404' replace />} />
						</Routes>
					</>
				)}
			</Router>
		</UserContext.Provider>
	)
}

export default App
