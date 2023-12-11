// importing css file, react and custom hoosk, user context, axios, emailjs and momentjs libraries

import './registerForm.css'

import { Link, useNavigate } from 'react-router-dom'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useOutsideClick } from '../../../utils/useOutsideClick'

import emailjs from '@emailjs/browser'

import { useToken } from '../../../utils/useToken'
import { useLocalStorage } from '../../../utils/useLocalStorage'
import moment from 'moment'
import Input from '../../input/Input'
import TagItem from '../../tagItem/TagItem'
import { tags } from './../../../helpers/tags'

const RegisterForm = ({ activeForm, setActiveForm }) => {
	// declaring variable that helps to get images from folder directly without importing

	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	// function that closes form

	const handleCloseForm = () => {
		setActiveForm(false)
		setActiveBlock('join')
		setInputName(prev => ({
			...prev,
			error: false,
		}))
	}

	// user data states
	const [userInStorage, setUserInStorage] = useLocalStorage('user')

	// active stage

	const [activeBlock, setActiveBlock] = useState('join')

	// declaring states of custom input fields

	const [inputName, setInputName] = useState({
		active: false,
		hasValue: false,
		label: '',
		value: '',
		name: 'Name',
		error: false,
		maxCount: 50,
	})

	const [inputEmail, setInputEmail] = useState({
		active: false,
		hasValue: false,
		label: '',
		value: '',
		name: 'Email',
		purpose: 'Emailreg',
		error: false,
		notCounter: true,
	})

	const [inputVerify, setInputVerify] = useState({
		active: false,
		hasValue: false,
		label: '',
		value: '',
		name: 'Verification code',
		notCounter: true,
	})

	const [inputPassword, setInputPassword] = useState({
		active: false,
		hasValue: false,
		label: '',
		value: '',
		name: 'Password',
		notCounter: true,
		error: false,
		purpose: 'Passwordreg',
	})

	const [inputId, setInputId] = useState({
		active: false,
		hasValue: false,
		label: '',
		value: '',
		name: 'User ID',
		notCounter: true,
		error: false,
	})

	const [activeMonth, setActiveMonth] = useState(false)
	const monthSelect = useOutsideClick(() => setActiveMonth(false))
	const [month, setMonth] = useState('')

	const [activeDay, setActiveDay] = useState(false)
	const daySelect = useOutsideClick(() => setActiveDay(false))
	const [day, setDay] = useState('')

	const [activeYear, setActiveYear] = useState(false)
	const yearSelect = useOutsideClick(() => setActiveYear(false))
	const [year, setYear] = useState('')

	const date = moment(month).format('MMMM') + ' ' + day + ', ' + year

	// simplifies writing every year since 1904 etc.

	const getList = type => {
		if (type === 'year') {
			const year = 1904
			return Array.from(new Array(120), (v, i) => (
				<option key={i} value={year + i}>
					{year + i}
				</option>
			))
		} else if (type === 'day') {
			return Array.from(new Array(31), (v, i) => (
				<option key={i} value={i + 1}>
					{i + 1}
				</option>
			))
		}
	}

	const handleSubmit = e => {
		e.preventDefault()
		setActiveBlock('customize')
	}

	// disabling

	const [disabledBtn, setDisabledBtn] = useState(true)

	useEffect(() => {
		if (
			inputName.hasValue &&
			!inputName.error &&
			inputEmail.hasValue &&
			!inputEmail.error &&
			month !== '' &&
			day !== '' &&
			year !== ''
		) {
			setDisabledBtn(false)
		} else {
			setDisabledBtn(true)
		}
	})

	const [activeCheckbox, setActiveCheckbox] = useState(true)

	// sending verification code

	const [verificationCode, setVerificationCode] = useState('')

	const templateParams = {
		user_name: inputName.value,
		user_email: inputEmail.value,
		verify_code: '',
	}

	const sendEmail = async () => {
		genVerifyCode()
		setActiveBlock('loader')
		templateParams.verify_code &&
			emailjs
				.send(
					'service_c5q7g9f',
					'template_rjb2qdf',
					templateParams,
					'NBl5OvfBt04mNHzTi'
				)
				.then(() => {
					setVerificationCode(templateParams.verify_code)
					setActiveBlock('verifyacc')
				})
	}

	const genVerifyCode = () => {
		const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
		const codeLength = 5
		let code = ''
		for (let i = 0; i <= codeLength; i++) {
			let randomNumber = Math.floor(Math.random() * chars.length)
			code += chars.substring(randomNumber, randomNumber + 1)
		}
		templateParams.verify_code = code
	}

	// checking verification code

	const [incorrectCode, setIncorrectCode] = useState(false)

	const verifyChecking = () => {
		if (verificationCode === inputVerify.value) {
			setActiveBlock('password')
			setIncorrectCode(false)
		} else {
			setIncorrectCode(true)
			setTimeout(() => setIncorrectCode(false), 5000)
		}
	}

	const navigate = useNavigate()

	const token = useToken()

	const checkUserId = async () => {
		try {
			const dbHasUserId = await axios.get(`/users/findById/${inputId.value}`)
			if (dbHasUserId.data?.userId) {
				setInputId(prev => ({
					...prev,
					label: '',
					error: true,
				}))
			} else {
				setInputId(prev => ({
					...prev,
					error: false,
				}))
				setActiveBlock('tags')
			}
		} catch (err) {
			setActiveBlock('tags')
		}
	}

	// register new user

	const registerUser = async () => {
		try {
			const userData = {
				username: inputName.value,
				email: inputEmail.value,
				password: inputPassword.value,
				birth: day + '.' + month + '.' + year,
				token: token,
				userId: `@${inputId.value}`,
				tags: chosenTags,
			}

			await axios.post('/auth/register', userData)

			setUserInStorage(userData?.token)
			setTimeout(() => {
				navigate('/')
			}, 1000)
			setTimeout(() => {
				document.location.reload()
			}, 1001)
		} catch (err) {
			console.log(err)
		}
	}

	const [chosenTags, setChosenTags] = useState([])

	return (
		<div className={activeForm ? 'registerForm active' : 'registerForm'}>
			<div className='formBlock'>
				{/* start register */}
				<div
					className='formMainBlock'
					style={{ display: activeBlock === 'join' ? 'block' : 'none' }}
				>
					<div className='formBlockTop'>
						<img className='logoImg' src={PF + 'logo/logo.png'} alt='' />
						<div className='crossBlock' onClick={handleCloseForm} title='Close'>
							<img src={PF + 'icon/utility/x.svg'} alt='' />
						</div>
					</div>
					<div className='registerFormBlockContainer'>
						<h1 className='formTitle'>Join Twitter today</h1>
						<div className='rightbarTopItem'>Sign up</div>
						<div className='rightbarTopItem'>Sign up</div>
						<div className='orBlock'>or</div>
						<div
							className='rightbarTopItem specialItem'
							onClick={() => setActiveBlock('createacc')}
						>
							Create account
						</div>
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
						<span className='formLogin'>
							Have an account already? <Link>Log In</Link>
						</span>
					</div>
				</div>
				<div
					className='formMainBlock'
					style={{ display: activeBlock === 'createacc' ? 'block' : 'none' }}
				>
					<div className='formBlockTop'>
						<h2 className='formBlockTopStep' style={{ marginLeft: '64px' }}>
							Step 1 of 5
						</h2>
						<div
							className='crossBlock'
							onClick={() => {
								setActiveForm(false)
								setActiveBlock('join')
							}}
							title='Close'
						>
							<img src={PF + 'icon/utility/x.svg'} alt='' />
						</div>
					</div>
					{/* name, email and birth */}
					<div className='registerFormBlockContainerStep'>
						<h1 className='formTitle' style={{ textAlign: 'left' }}>
							Create your account
						</h1>
						<form onSubmit={handleSubmit}>
							<Input inputState={inputName} setInputState={setInputName} />
							<span className='errorMessage'>
								{inputName.error ? 'What’s your name?' : ''}
							</span>
							<Input inputState={inputEmail} setInputState={setInputEmail} />
							<span className='errorMessage'>
								{inputEmail.error === 'dbHasEmail'
									? 'Email has already been taken'
									: inputEmail.error === 'wrongEmail'
									? 'Please enter a valid email.'
									: ''}
							</span>
							<div className='formBottom'>
								<h3 className='formBottomTitle'>Date of birth</h3>
								<p className='formBottomDesc'>
									This will not be shown publicly. Confirm your own age, even if
									this account is for a business, a pet, or something else.
								</p>
								<div className='formBottomInputBlock'>
									<div
										ref={monthSelect}
										className='formBottomSelectBlock'
										style={{ borderColor: activeMonth ? '#1D9BF0' : '#CFD9DE' }}
									>
										<label
											style={{ color: activeMonth ? '#1D9BF0' : '#536471' }}
											htmlFor='month'
											onClick={() => setActiveMonth(true)}
										>
											Month
										</label>
										<select
											id='month'
											onClick={() => setActiveMonth(true)}
											onChange={e => setMonth(e.target.value)}
										>
											<option value='none' />
											<option value='1'>January</option>
											<option value='2'>February</option>
											<option value='3'>March</option>
											<option value='4'>April</option>
											<option value='5'>May</option>
											<option value='6'>June</option>
											<option value='7'>July</option>
											<option value='8'>August</option>
											<option value='9'>September</option>
											<option value='10'>October</option>
											<option value='11'>November</option>
											<option value='12'>December</option>
										</select>
										<svg
											className='selectChevron'
											xmlns='http://www.w3.org/2000/svg'
											width='50'
											height='50'
											viewBox='0 0 24 24'
											fill='none'
											stroke={activeMonth ? '#1D9BF0' : '#494E51'}
											strokeWidth='1.5'
											strokeLinecap='round'
											strokeLinejoin='round'
										>
											<polyline points='6 9 12 15 18 9'></polyline>
										</svg>
									</div>
									<div
										ref={daySelect}
										className='formBottomSelectBlock'
										style={{
											borderColor: activeDay ? '#1D9BF0' : '#CFD9DE',
											width: '96px',
										}}
									>
										<label
											style={{ color: activeDay ? '#1D9BF0' : '#536471' }}
											htmlFor='day'
											onClick={() => setActiveDay(true)}
										>
											Day
										</label>
										<select
											id='day'
											style={{ width: '90px' }}
											onClick={() => setActiveDay(true)}
											onChange={e => setDay(e.target.value)}
										>
											<option value='none' />
											{getList('day')}
										</select>
										<svg
											className='selectChevron'
											xmlns='http://www.w3.org/2000/svg'
											width='50'
											height='50'
											viewBox='0 0 24 24'
											fill='none'
											stroke={activeDay ? '#1D9BF0' : '#494E51'}
											strokeWidth='1.5'
											strokeLinecap='round'
											strokeLinejoin='round'
										>
											<polyline points='6 9 12 15 18 9'></polyline>
										</svg>
									</div>
									<div
										ref={yearSelect}
										className='formBottomSelectBlock'
										style={{
											borderColor: activeYear ? '#1D9BF0' : '#CFD9DE',
											width: '118px',
										}}
									>
										<label
											style={{ color: activeYear ? '#1D9BF0' : '#536471' }}
											htmlFor='year'
											onClick={() => setActiveYear(true)}
										>
											Year
										</label>
										<select
											id='year'
											style={{ width: '118px' }}
											onClick={() => setActiveYear(true)}
											onChange={e => setYear(e.target.value)}
										>
											<option value='none' />
											{getList('year')}
										</select>
										<svg
											className='selectChevron'
											xmlns='http://www.w3.org/2000/svg'
											width='50'
											height='50'
											viewBox='0 0 24 24'
											fill='none'
											stroke={activeYear ? '#1D9BF0' : '#494E51'}
											strokeWidth='1.5'
											strokeLinecap='round'
											strokeLinejoin='round'
										>
											<polyline points='6 9 12 15 18 9'></polyline>
										</svg>
									</div>
								</div>
							</div>
							<button
								className={disabledBtn ? 'submitBtn disabled' : 'submitBtn'}
								disabled={disabledBtn}
								type='submit'
							>
								Next
							</button>
						</form>
					</div>
				</div>
				<div
					className='formMainBlock'
					style={{ display: activeBlock === 'customize' ? 'block' : 'none' }}
				>
					<div className='formBlockTop'>
						<div className='formBlockTopLeft'>
							<div
								className='arrowBlock'
								onClick={() => setActiveBlock('createacc')}
							>
								<img src={PF + 'icon/utility/arrowLeft.svg'} alt='' />
							</div>
							<h2 className='formBlockTopStep'>Step 2 of 5</h2>
						</div>
					</div>
					{/* checkbox block */}
					<div className='registerFormBlockContainerStep'>
						<h1 className='formTitle' style={{ textAlign: 'left' }}>
							Customize your experience
						</h1>
						<h2 className='formPostTitle'>
							Track where you see Twitter content across the web
						</h2>
						<div className='formCustomizeInputBlock'>
							<label htmlFor='tracking'>
								Twitter uses this data to personalize your experience. This web
								browsing history will never be stored with your name, email, or
								phone number.
							</label>
							<div
								className={
									activeCheckbox ? 'checkboxBlock active' : 'checkboxBlock'
								}
								onClick={() => setActiveCheckbox(!activeCheckbox)}
							>
								<input
									type='checkbox'
									onChange={() => setActiveCheckbox(!activeCheckbox)}
									checked={activeCheckbox}
								/>
							</div>
						</div>
						<p className='formText'>
							By signing up, you agree to our <Link>Terms</Link>,{' '}
							<Link>Privacy Policy</Link>, and <Link>Cookie Use</Link>. Twitter
							may use your contact information, including your email address and
							phone number for purposes outlined in our Privacy Policy.{' '}
							<Link>Learn more</Link>{' '}
						</p>
						<button
							className='submitBtn'
							style={{ marginTop: '196px' }}
							onClick={() => setActiveBlock('createaccconfirm')}
						>
							Next
						</button>
					</div>
				</div>
				<div
					className='formMainBlock'
					style={{
						display: activeBlock === 'createaccconfirm' ? 'block' : 'none',
					}}
				>
					<div className='formBlockTop'>
						<div className='formBlockTopLeft'>
							<div
								className='arrowBlock'
								onClick={() => setActiveBlock('customize')}
							>
								<img src={PF + 'icon/utility/arrowLeft.svg'} alt='' />
							</div>
							<h2 className='formBlockTopStep'>Step 3 of 5</h2>
						</div>
						<div
							className='crossBlock'
							onClick={() => {
								setActiveForm(false)
								setActiveBlock('join')
							}}
							title='Close'
						>
							<img src={PF + 'icon/utility/x.svg'} alt='' />
						</div>
					</div>
					{/* checking */}
					<div className='registerFormBlockContainerStep'>
						<h1 className='formTitle' style={{ textAlign: 'left' }}>
							Create your account
						</h1>
						<div
							className='customInputBlock'
							style={{ marginTop: '25px' }}
							onClick={() => setActiveBlock('createacc')}
						>
							<label className='customInputLabel active' htmlFor='nameInput'>
								Name
							</label>
							<input
								id='nameInput'
								name='user_name'
								type='text'
								className='customInput'
								value={inputName.value}
							/>
						</div>
						<div
							className='customInputBlock'
							style={{ marginTop: '25px' }}
							onClick={() => setActiveBlock('createacc')}
						>
							<label className='customInputLabel active' htmlFor='emailInput'>
								Email
							</label>
							<input
								id='emailInput'
								name='user_email'
								type='email'
								className='customInput'
								value={inputEmail.value}
							/>
						</div>
						<div
							className='customInputBlock'
							style={{ marginTop: '25px' }}
							onClick={() => setActiveBlock('createacc')}
						>
							<label className='customInputLabel active' htmlFor='dateInput'>
								Date of birth
							</label>
							<input
								id='dateInput'
								type='text'
								className='customInput'
								value={date}
							/>
						</div>
						<p className='formTextSmall' style={{ marginTop: '60px' }}>
							By signing up, you agree to the <Link>Terms of Service</Link> and{' '}
							<Link>Privacy Policy</Link>, including <Link> Cookie Use</Link>.
							Twitter may use your contact information, including your email
							address and phone number for purposes outlined in our Privacy
							Policy, like keeping your account secure and personalizing our
							services, including ads. <Link> Learn more</Link>. Others will be
							able to find you by email or phone number, when provided, unless
							you choose otherwise <Link> here</Link>.
						</p>
						<button className='submitBtn blue' onClick={sendEmail}>
							Sign up
						</button>
					</div>
				</div>
				{/* loading spinner */}
				<div
					className='loader'
					style={{ display: activeBlock === 'loader' ? 'block' : 'none' }}
				/>
				<div
					className='formMainBlock'
					style={{ display: activeBlock === 'verifyacc' ? 'block' : 'none' }}
				>
					<div className='formBlockTop'>
						<div className='formBlockTopLeft'>
							<div
								className='arrowBlock'
								onClick={() => setActiveBlock('createaccconfirm')}
							>
								<img src={PF + 'icon/utility/arrowLeft.svg'} alt='' />
							</div>
							<h2 className='formBlockTopStep'>Step 4 of 5</h2>
						</div>
						<div
							className='crossBlock'
							onClick={() => {
								setActiveForm(false)
								setActiveBlock('join')
							}}
							title='Close'
						>
							<img src={PF + 'icon/utility/x.svg'} alt='' />
						</div>
					</div>
					<div className='registerFormBlockContainerStep'>
						{/* verification code */}
						<h1 className='formTitle' style={{ textAlign: 'left' }}>
							We sent you a code
						</h1>
						<p className='formText' style={{ marginTop: '0px' }}>
							Enter it below to verify {inputEmail.value}
						</p>
						<Input inputState={inputVerify} setInputState={setInputVerify} />
						<button
							className={
								inputVerify.hasValue ? 'submitBtn' : 'submitBtn disabled'
							}
							style={{ marginTop: '350px' }}
							disabled={inputVerify.hasValue ? false : true}
							type='submit'
							onClick={verifyChecking}
						>
							Next
						</button>
					</div>
				</div>
				{/* error alert */}
				<div className={incorrectCode ? 'formModal active' : 'formModal'}>
					<span>The code you entered is incorrect. Please try again.</span>
				</div>
				<div
					className='formMainBlock'
					style={{ display: activeBlock === 'password' ? 'block' : 'none' }}
				>
					<div className='formBlockTop'>
						<div className='formBlockTopLeft'>
							<h2 className='formBlockTopStep' style={{ marginLeft: '64px' }}>
								Step 5 of 5
							</h2>
						</div>
						<div
							className='crossBlock'
							onClick={() => {
								setActiveForm(false)
								setActiveBlock('join')
							}}
							title='Close'
						>
							<img src={PF + 'icon/utility/x.svg'} alt='' />
						</div>
					</div>
					<div className='registerFormBlockContainerStep'>
						{/* password */}
						<h1 className='formTitle' style={{ textAlign: 'left' }}>
							You'll need a password
						</h1>
						<p className='formText' style={{ marginTop: '0px' }}>
							Make sure it’s 8 characters or more.
						</p>
						<Input
							inputState={inputPassword}
							setInputState={setInputPassword}
						/>
						<span className='errorMessage'>
							{inputPassword.error
								? 'Your password needs to be at least 8 characters. Please enter a longer one.'
								: ''}
						</span>
						<button
							className={
								inputPassword.hasValue ? 'submitBtn' : 'submitBtn disabled'
							}
							style={{ marginTop: '350px' }}
							disabled={inputPassword.hasValue ? false : true}
							onClick={() => setActiveBlock('userid')}
						>
							Next
						</button>
					</div>
				</div>
				<div
					className='formMainBlock'
					style={{ display: activeBlock === 'userid' ? 'block' : 'none' }}
				>
					<div className='formBlockTop'>
						<img className='logoImg' src={PF + 'logo/logo.png'} alt='' />
					</div>
					<div className='registerFormBlockContainerStep'>
						{/* userID */}
						<h1 className='formTitle' style={{ textAlign: 'left' }}>
							What will be your ID?
						</h1>
						<p className='formText' style={{ marginTop: '0px' }}>
							Your user ID is unique. You can change it whenever you want
						</p>
						<Input inputState={inputId} setInputState={setInputId} />

						<span className='errorMessage'>
							{inputId.error ? 'This user ID has already been taken' : ''}
						</span>
						<button
							className={
								inputId.hasValue && !inputId.error
									? 'submitBtn'
									: 'submitBtn disabled'
							}
							style={{ marginTop: '350px' }}
							disabled={inputId.hasValue && !inputId.error ? false : true}
							type='submit'
							onClick={() => checkUserId()}
						>
							Next
						</button>
					</div>
				</div>
				<div
					className='formMainBlock'
					style={{ display: activeBlock === 'tags' ? 'block' : 'none' }}
				>
					<div className='formBlockTop'>
						<img className='logoImg' src={PF + 'logo/logo.png'} alt='' />
					</div>
					<div className='registerFormBlockContainerStep'>
						<h1 className='formTitle' style={{ textAlign: 'left' }}>
							Choose your tags (optional)
						</h1>
						<p className='formText' style={{ marginTop: '0px' }}>
							Choose tags that interest you to customize your experience on
							Twitter.
						</p>
						<div className='profileTagsList'>
							{tags.map((tag, index) => (
								<TagItem
									key={index}
									tag={tag}
									chosenTags={chosenTags}
									setChosenTags={setChosenTags}
								/>
							))}
						</div>
						<button
							className={'submitBtn'}
							style={{ marginTop: '200px' }}
							type='submit'
							onClick={registerUser}
						>
							Register
						</button>
					</div>
				</div>
			</div>
			<div className='overlay' onClick={handleCloseForm} />
		</div>
	)
}

export default RegisterForm
