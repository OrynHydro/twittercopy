// import css, navigation component and object of arrays

import './verifiedOrganizations.css'
import { verifiedListItems } from '../../../helpers/verified'
import { Link } from 'react-router-dom'

const VerifiedOrganizations = ({ active, setActive }) => {
	// declaring variable that helps to get images from folder directly without importing

	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	return (
		<div className={active ? 'verified active' : 'verified'}>
			<div className='verifiedContainer'>
				<div className='verifiedTop'>
					<div
						className='crossBlock'
						onClick={() => setActive(false)}
						title='Close'
					>
						<img src={PF + 'icon/utility/x.svg'} alt='' />
					</div>
				</div>
				<div className='verifiedMid'>
					<h1 className='verifiedTitle'>Verified Organizations</h1>
					<h2 className='verifiedPostTitle'>
						Verified Organizations is for organizations of all types–businesses,
						non-profits, and government institutions–to manage their
						verification,affiliate and verify any related account, and unlock
						new features.
					</h2>
					<ul className='verifiedList'>
						{/* shortened code of big amount of data */}
						{verifiedListItems.map(props => (
							<li key={props.id} className='verifiedListItem'>
								<h3 className='verifiedListTitle'>{props?.title}</h3>
								<p
									className={
										!props?.title
											? 'verifiedListText special'
											: 'verifiedListText'
									}
								>
									{props.text}
								</p>
							</li>
						))}
					</ul>
					<p className='learnMore'>Learn more</p>
					<button className='verifiedBtn'>Subscribe & Pay</button>
					<p className='verifiedDesc'>
						By clicking Subscribe, you agree to our Purchaser Terms of Service.
						Subscriptions auto-renew until canceled, as described in the Terms.
						Cancel anytime. Accounts that sign up are reviewed. If we determine
						at any time that your main account is not an organization or you
						violate our terms and policies, your subscription will be canceled
						and you will not be refunded during your existing billing period
						unless required by law. See more <Link>here</Link>
					</p>
				</div>
			</div>
			<div className='overlay' onClick={() => setActive(false)}></div>
		</div>
	)
}

export default VerifiedOrganizations
