// import css, navigation link, react hooks and helpers list

import './twitterProfessionals.css'

import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { Categories } from '../../helpers/categories'
import Input from '../input/Input'

const TwitterProfessionals = ({ active, setActive }) => {
	// declaring variable that helps to get images from folder directly without importing

	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	// active block state

	const [activeIntroduction, setActiveIntroduction] = useState(true)
	const [activeDesc, setActiveDesc] = useState(false)
	const [activeCategory, setActiveCategory] = useState(false)
	const [activeAccType, setActiveAccType] = useState(false)

	// custom input states

	const [inputState, setInputState] = useState({
		active: false,
		hasValue: false,
		label: '',
		value: '',
		name: 'Add a description here',
		maxCount: 160,
	})

	const [activeInput, setActiveInput] = useState(false)
	const [hasValue, setHasValue] = useState(false)
	const [activeLabelBlue, setActiveLabelBlue] = useState(false)
	const [activeLabelGray, setActiveLabelGray] = useState(false)
	const [inputValue, setInputValue] = useState('')
	const [radioInputHasValue, setRadioInputHasValue] = useState(false)

	// custom input change state

	useEffect(() => {
		if (activeInput) {
			setActiveLabelBlue(true)
			setActiveLabelGray(false)
		}
		if (hasValue && !activeInput) {
			setActiveLabelGray(true)
			setActiveLabelBlue(false)
		}
		if (!hasValue && !activeInput) {
			setActiveLabelGray(false)
			setActiveLabelBlue(false)
		}
	})

	const handleInputChange = e => {
		setHasValue(true)
		setInputValue(e.target.value)
	}

	const input = useRef()
	const [activeCategoryInput, setActiveCategoryInput] = useState(false)
	const [hasValueCategory, setHasValueCategory] = useState(false)

	return (
		<div className={active ? 'professionals active' : 'professionals'}>
			<div className='professionalsContainer'>
				<div className='professionalsTop'>
					{/* closes modal window */}
					<div
						className='professionalsCrossBlock'
						onClick={() => {
							if (activeDesc) {
								setActiveDesc(false)
								setActiveIntroduction(true)
							}
							if (activeCategory) {
								setActiveCategory(false)
								setActiveDesc(true)
							}
							if (activeAccType) {
								setActiveAccType(false)
								setActiveCategory(true)
							}
							if (activeIntroduction) {
								setActive(false)
							}
						}}
					>
						<img
							src={
								activeIntroduction
									? PF + 'icon/utility/x.svg'
									: PF + 'icon/utility/arrowLeft.svg'
							}
							alt=''
						/>
					</div>
					<img src={PF + 'logo/logo.png'} className='professionalsLogo' />
				</div>
				{/* introduction block */}
				<div
					className='professionalsMain'
					style={{ display: activeIntroduction ? 'block' : 'none' }}
				>
					<img
						className='professionalsImg'
						src='https://ton.twimg.com/onboarding/professional_profiles/upsell_header_wide_v2.png'
						alt=''
					/>
					<div className='professionalsContent'>
						<h1 className='professionalsTitle'>Twitter for Professionals</h1>
						<p className='professionalsDesc'>
							Get access to the tools you need to better connect with your
							audience, grow your brand, and increase your profits.
						</p>
						<p className='professionalsPolicy'>
							By tapping "Agree & continue", you are agreeing to our{' '}
							<Link>Professional Account policy. </Link>{' '}
						</p>
						<button
							className='professionalsAgreeBtn'
							onClick={() => {
								setActiveIntroduction(false)
								setActiveDesc(true)
							}}
						>
							Agree & Continue
						</button>
					</div>
				</div>
				{/* description block */}
				<div
					className='professionalsMain'
					style={{ display: activeDesc ? 'block' : 'none' }}
				>
					<div className='professionalsContent'>
						<h1 className='professionalsTitle'>Tell us about yourself</h1>
						<p className='professionalsDesc' style={{ margin: '15px 0px' }}>
							Add a business description or personal bio to switch to a
							professional account.
						</p>
						<div
							className={
								activeInput
									? 'customInputBlock active'
									: 'customInputBlock nameInput'
							}
							onClick={() => setActiveInput(true)}
							onBlur={() => setActiveInput(false)}
						>
							<span
								className='customInputCounter'
								style={{ display: activeInput ? 'inline' : 'none' }}
							>
								{hasValue === false && inputValue.length === 1
									? 0
									: inputValue.length}{' '}
								/ 160
							</span>
							<label
								className={
									activeLabelBlue
										? 'customInputLabel activeBlue'
										: activeLabelGray
										? 'customInputLabel active'
										: 'customInputLabel'
								}
								htmlFor='nameInput'
							>
								Add a description here
							</label>
							<textarea
								maxLength={160}
								id='nameInput'
								type='text'
								className='customInput'
								onChange={e =>
									e.target.value ? handleInputChange(e) : setHasValue(false)
								}
							/>
						</div>
						{/* <Input inputState={inputState} setInputState={setInputState} /> */}
						<button
							className='professionalsAgreeBtn'
							style={{
								marginTop: '350px',
								background:
									hasValue && inputValue.length > 0 ? '#0f1419' : '#87898C',
							}}
							onClick={() => {
								setActiveDesc(false)
								setActiveCategory(true)
							}}
							disabled={hasValue && inputValue.length > 0 ? false : true}
						>
							Next
						</button>
					</div>
				</div>
				{/* category block */}
				<div
					className='professionalsMain'
					style={{ display: activeCategory ? 'block' : 'none' }}
				>
					<div
						className='professionalsContent'
						style={{ overflowY: 'scroll', overflowX: 'hidden' }}
					>
						<h1 className='professionalsTitle'>Select a category</h1>
						<p className='professionalsDesc' style={{ margin: '15px 0px' }}>
							Choose the category to display on your profile. Pick the one that
							best describes your account. This will be shown on your public
							profile.
						</p>
						<div
							className='professionalsCategoryInputBlock'
							style={{
								borderColor: activeCategoryInput ? '#1D9BF0' : '#D8E0E4',
							}}
						>
							<img
								className='search'
								src={PF + 'icon/utility/search.svg'}
								alt=''
							/>
							<input
								className='professionalsCategoryInput'
								autoFocus
								ref={input}
								onChange={e =>
									e.target.value !== ''
										? setHasValueCategory(true)
										: e.target.value === ''
										? setHasValueCategory(false)
										: false
								}
								onClick={() => setActiveCategoryInput(true)}
								onBlur={() => setActiveCategoryInput(false)}
								placeholder='Search categories'
							/>
							<img
								className='xCircle'
								onClick={() => (input.current.value = '')}
								style={{ display: hasValueCategory ? 'block' : 'none' }}
								src={PF + 'icon/utility/xCircle.svg'}
								alt=''
							/>
						</div>
						<form className='professionalsCategoryInputsBlock'>
							{/* shortened code of big amount of items */}
							{Categories.map(item => (
								<div key={item.id} className='professionalsRadioInputBlock'>
									<label htmlFor={item.title}>{item.title}</label>
									<div className='radioInputBlock'>
										<input
											onChange={() => setRadioInputHasValue(true)}
											name='radioInput'
											id={item.title}
											type='radio'
										/>
									</div>
								</div>
							))}
						</form>
					</div>
					<div className='professionalsBtnBlock'>
						<button
							className='professionalsAgreeBtn'
							onClick={() => {
								setActiveCategory(false)
								setActiveAccType(true)
							}}
							disabled={radioInputHasValue ? false : true}
							style={{ background: radioInputHasValue ? '#0f1419' : '#87898C' }}
						>
							Next
						</button>
					</div>
				</div>
				{/* choosing account type block */}
				<div
					className='professionalsMain'
					style={{ display: activeAccType ? 'block' : 'none' }}
				>
					<div className='professionalsContent'>
						<h1 className='professionalsTitle'>Select an account type</h1>
						<p
							className='professionalsDesc'
							style={{ margin: '15px 0px 35px' }}
						>
							Choose the one that best aligns with your profession. Don’t worry,
							you can change this later.
						</p>
						<label htmlFor='input1' className='professionalsAccTypeBlock'>
							<div className='professionalsAccTypeTextBlock'>
								<h2>Business</h2>
								<span>
									Best fit for brands, retail shops, service providers, and
									organizations
								</span>
							</div>
							<div className='radioInputBlock'>
								<input
									defaultChecked='true'
									name='radioInput'
									id='input1'
									type='radio'
								/>
							</div>
						</label>
						<label
							htmlFor='input2'
							className='professionalsAccTypeBlock'
							style={{ marginTop: '10px' }}
						>
							<div className='professionalsAccTypeTextBlock'>
								<h2>Creator</h2>
								<span>
									Best fit for public figures, artists, and influencers
								</span>
							</div>
							<div className='radioInputBlock'>
								<input name='radioInput' id='input2' type='radio' />
							</div>
						</label>
						<button
							className='professionalsAgreeBtn'
							style={{ marginTop: '220px' }}
							onClick={() => {
								setActiveIntroduction(true)
								setActiveDesc(false)
								setActiveCategory(false)
								setActiveAccType(false)
								setActive(false)
							}}
						>
							Next
						</button>
					</div>
				</div>
			</div>
			<div
				className='overlay'
				onClick={() => {
					setActiveIntroduction(true)
					setActiveDesc(false)
					setActiveCategory(false)
					setActiveAccType(false)
					setActive(false)
				}}
			/>
		</div>
	)
}

export default TwitterProfessionals
