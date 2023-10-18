// import css, navigation link and footer component

import './rightbar.css'

import { Link } from 'react-router-dom'
import { Footer } from './../../index'

const Rightbar = () => {
	return (
		//  main rightbar content
		<div className='rightbar'>
			<div className='rightbarContainer'>
				<div className='rightbarTop'>
					<div className='rightbarTopContainer'>
						<h1 className='rightbarTopTitle'>New to Twitter?</h1>
						<p className='rightbarTopSubtitle'>
							Sign up now to get your own personalized timeline!
						</p>
						<div className='rightbarTopItem'>Create account</div>
						<div className='rightbarTopItem'>Create account</div>
						<div className='rightbarTopItem'>Create account</div>
						<div className='rightbarTopInfo'>
							By singing up, you agree to the{' '}
							<Link>
								<span className='rightbarTopInfoLink'>Terms of Service</span>
							</Link>{' '}
							and{' '}
							<Link>
								<span className='rightbarTopInfoLink'>Privacy Policy</span>
							</Link>
							, including{' '}
							<Link>
								<span className='rightbarTopInfoLink'>Cookie Use.</span>
							</Link>
						</div>
					</div>
				</div>
				{/* footer component */}
				<Footer />
			</div>
		</div>
	)
}

export default Rightbar
