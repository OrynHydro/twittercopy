// importing css file, navigation components, react and custom hooks, user contex, axios and emailjs libraries

import './loginForm.css'

import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'

import axios from 'axios'
import { UserContext } from '../../../context/UserContext'

import emailjs from '@emailjs/browser'
import { useLocalStorage } from '../../../utils/useLocalStorage'
import { Input } from '../../index'

const LoginForm = ({ activeForm, setActiveForm }) => {
	// declaring variable that helps to get images from folder directly without importing

	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	// declaring active block state

	const [activeBlock, setActiveBlock] = useState('name')

	// declaring states of custom input fields

	const [inputEmail, setInputEmail] = useState({
		active: false,
		hasValue: false,
		label: '',
		value: '',
		name: 'Email',
		error: false,
		loading: false,
		notCounter: true,
	})

	const [inputPassword, setInputPassword] = useState({
		active: false,
		hasValue: false,
		label: '',
		value: '',
		name: 'Password',
		error: false,
		loading: false,
		notCounter: true,
	})

	const [inputConfirm, setInputConfirm] = useState({
		active: false,
		hasValue: false,
		label: '',
		value: '',
		name: 'Confirmation code',
		error: false,
		notCounter: true,
	})

	const [inputNewPassword, setInputNewPassword] = useState({
		active: false,
		hasValue: false,
		label: '',
		value: '',
		name: 'New password',
		error: false,
		notCounter: true,
	})

	const [inputConfirmNewPassword, setInputConfirmNewPassword] = useState({
		active: false,
		hasValue: false,
		label: '',
		value: '',
		name: 'Confirm new password',
		error: false,
		notCounter: true,
	})

	// user data states

	const { user, setUser } = useContext(UserContext)
	const [userInStorage, setUserInStorage] = useLocalStorage('user')

	// validates email if exists in db or if the field is empty

	const handleEmailButtonClick = async () => {
		setInputEmail(prev => ({
			...prev,
			loading: true,
		}))
		if (inputEmail.hasValue) {
			setInputEmail(prev => ({
				...prev,
				error: false,
			}))
			const dbHasEmail = await axios.get(
				`/users/findByEmail/${inputEmail.value}`
			)
			if (!dbHasEmail?.data[0]?.email) {
				setInputEmail(prev => ({
					...prev,
					error: 'wrongemail',
				}))
				setTimeout(
					() =>
						setInputEmail(prev => ({
							...prev,
							error: false,
						})),
					5000
				)
			} else {
				setInputEmail(prev => ({
					...prev,
					error: false,
				}))
				setActiveBlock('password')
			}
			setInputEmail(prev => ({
				...prev,
				loading: false,
			}))
		} else {
			setInputEmail(prev => ({
				...prev,
				error: 'emptyfield',
				loading: false,
			}))
			setTimeout(
				() =>
					setInputEmail(prev => ({
						...prev,
						error: false,
					})),
				5000
			)
		}
	}

	// variable in useNavigate react-router-dom hook

	const navigate = useNavigate()

	// logins user

	const loginUser = async () => {
		setInputPassword(prev => ({
			...prev,
			loading: true,
		}))
		try {
			const userData = {
				email: inputEmail.value,
				password: inputPassword.value,
			}
			const newCurrentUser = await axios.get(
				`/users/findByEmail/${inputEmail.value}`
			)
			await axios.post('/auth/login', userData)
			setUserInStorage(newCurrentUser.data[0].token)
			setTimeout(() => {
				navigate('/')
			}, 1000)
			setTimeout(() => {
				document.location.reload()
			}, 1001)
			// document.location.reload(); navigate('/')
			setInputPassword(prev => ({
				...prev,
				error: false,
				loading: false,
			}))
		} catch {
			setInputPassword(prev => ({
				...prev,
				error: true,
				loading: false,
			}))
			setTimeout(
				() =>
					setInputPassword(prev => ({
						...prev,
						error: false,
					})),
				5000
			)
		}
	}

	// reset password functions

	const [resetPassCode, setResetPassCode] = useState('')

	const templateParams = {
		user_email: inputEmail.value,
		resetPass_code: '',
	}

	const handleSendResetPassCode = async () => {
		if (inputEmail.hasValue) {
			genConfirmCode()
			setActiveBlock('loader')
			templateParams.resetPass_code &&
				emailjs
					.send(
						'service_c5q7g9f',
						'template_a6fwsnh',
						templateParams,
						'NBl5OvfBt04mNHzTi'
					)
					.then(() => {
						setResetPassCode(templateParams.resetPass_code)
						console.log(templateParams.resetPass_code)
						setActiveBlock('enterresetpass')
					})
		}
	}

	// generates confirm code

	const genConfirmCode = () => {
		const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
		const codeLength = 5
		let code = ''
		for (let i = 0; i <= codeLength; i++) {
			let randomNumber = Math.floor(Math.random() * chars.length)
			code += chars.substring(randomNumber, randomNumber + 1)
		}
		templateParams.resetPass_code = code
	}

	// checks if code is correct

	const confirmCodeChecking = () => {
		if (!inputConfirm.hasValue) setActiveBlock('resetpass')
		else if (resetPassCode === inputConfirm.value) {
			setActiveBlock('newpassword')
			setInputConfirm(prev => ({
				...prev,
				error: false,
			}))
		} else if (resetPassCode !== inputConfirm.value) {
			setInputConfirm(prev => ({
				...prev,
				error: true,
			}))
			setTimeout(
				() =>
					setInputConfirm(prev => ({
						...prev,
						error: false,
					})),
				5000
			)
		}
	}

	// changes user's password

	const changeUserPassword = async () => {
		if (
			inputNewPassword.hasValue &&
			inputConfirmNewPassword.hasValue &&
			!inputNewPassword.error & !inputConfirmNewPassword.error
		) {
			try {
				await axios.put(`/users/${inputEmail.value}`, {
					password: inputNewPassword.value,
				})
				const newCurrentUser = await axios.get(
					`/users/findByEmail/${inputEmail.value}`
				)
				setUser(newCurrentUser.data[0])
				navigate('/')
				document.location.reload()
			} catch (err) {
				console.log(err)
			}
		}
	}

	return (
		<div className={activeForm ? 'loginForm active' : 'loginForm'}>
			<div className='formBlock'>
				{/* block with email input */}
				<div style={{ display: activeBlock !== 'name' && 'none' }}>
					<div className='formBlockTop'>
						<img className='logoImg' src={PF + 'logo/logo.png'} alt='' />
						<div
							className='crossBlock'
							onClick={() => {
								setActiveForm(false)
								setActiveBlock('name')
								setInputEmail(prev => ({
									...prev,
									error: false,
								}))
								setInputPassword(prev => ({
									...prev,
									error: false,
								}))
							}}
							title='Close'
						>
							<img src={PF + 'icon/utility/x.svg'} alt='' />
						</div>
					</div>
					<div className='formContainer'>
						<h1 className='formTitle'>Sign in to Twitter</h1>
						<div className='rightbarTopItem'>Sign in</div>
						<div className='rightbarTopItem'>Sign in</div>
						<div className='orBlock'>or</div>
						<div style={{ marginTop: '20px' }}>
							<Input inputState={inputEmail} setInputState={setInputEmail} />
						</div>

						<div
							className={
								inputEmail.loading
									? 'rightbarTopItem specialItem button loadingBtn'
									: 'rightbarTopItem specialItem button'
							}
							onClick={handleEmailButtonClick}
						>
							<span>Next</span>
						</div>
						<div className='rightbarTopItem specialItemWhite'>
							Forgot password
						</div>
						<span className='formSignUp'>
							Don't have an account? <Link>Sign up</Link>
						</span>
					</div>
				</div>
				{/* block with password input */}
				<div
					className='passwordContainer'
					style={{ display: activeBlock !== 'password' && 'none' }}
				>
					<div className='formBlockTop'>
						<img className='logoImg' src={PF + 'logo/logo.png'} alt='' />
						<div
							className='crossBlock'
							onClick={() => {
								setActiveForm(false)
								setActiveBlock('name')
							}}
							title='Close'
						>
							<img src={PF + 'icon/utility/x.svg'} alt='' />
						</div>
					</div>
					<div className='formContainer'>
						<h1 className='formTitle' style={{ textAlign: 'left' }}>
							Enter your password
						</h1>
						<div
							className='customInputBlock disabled'
							style={{ marginTop: '20px' }}
						>
							<label
								className='customInputLabel active'
								style={{ cursor: 'default' }}
							>
								Email
							</label>
							<input
								disabled
								value={inputEmail.value}
								type='text'
								className='customInput'
							/>
						</div>
						<div style={{ marginTop: '20px' }}>
							<Input
								inputState={inputPassword}
								setInputState={setInputPassword}
							/>
						</div>

						<span className='link' onClick={() => setActiveBlock('resetpass')}>
							Forgot password?
						</span>
						<button
							className={
								inputPassword.hasValue && inputPassword.loading
									? 'submitBtn loading'
									: inputPassword.hasValue
									? 'submitBtn'
									: 'submitBtn disabled'
							}
							disabled={inputPassword.hasValue ? false : true}
							style={{ margin: '270px 0 20px' }}
							onClick={loginUser}
						>
							<span>Log in</span>
						</button>
						<span className='signupBtn'>
							Don't have an account? <span className='link'>Sign up</span>
						</span>
					</div>
				</div>
				{/* reset password block */}
				<div
					className='resetPasswordContainer'
					style={{ display: activeBlock !== 'resetpass' && 'none' }}
				>
					<div className='formBlockTop'>
						<img className='logoImg' src={PF + 'logo/logo.png'} alt='' />
						<div
							className='crossBlock'
							onClick={() => {
								setActiveForm(false)
								setActiveBlock('name')
							}}
							title='Close'
						>
							<img src={PF + 'icon/utility/x.svg'} alt='' />
						</div>
					</div>
					<div className='formContainer'>
						<h1 className='formTitle' style={{ textAlign: 'left' }}>
							Find your account in Twitter
						</h1>
						<p className='formBottomDesc'>
							To change your password, enter the email, associated with your
							account.
						</p>
						<div style={{ marginTop: '20px' }}>
							<Input inputState={inputEmail} setInputState={setInputEmail} />
						</div>
						<button
							className={
								!inputEmail.hasValue ? 'submitBtn disabled' : 'submitBtn'
							}
							disabled={!inputEmail.hasValue}
							style={{ marginTop: '350px' }}
							type='submit'
							onClick={handleSendResetPassCode}
						>
							Next
						</button>
					</div>
				</div>
				{/* loading spinner */}
				<div
					className='loader'
					style={{ display: activeBlock !== 'loader' && 'none' }}
				/>
				{/* confirmation code block */}
				<div
					className='resetPasswordContainer'
					style={{ display: activeBlock !== 'enterresetpass' && 'none' }}
				>
					<div className='formBlockTop'>
						<img className='logoImg' src={PF + 'logo/logo.png'} alt='' />
						<div
							className='crossBlock'
							onClick={() => {
								setActiveForm(false)
								setActiveBlock('name')
							}}
							title='Close'
						>
							<img src={PF + 'icon/utility/x.svg'} alt='' />
						</div>
					</div>
					<div className='formContainer'>
						<h1 className='formTitle' style={{ textAlign: 'left' }}>
							We have sent you a code
						</h1>
						<p className='formBottomDesc'>
							Check to see if the confirmation code arrived in your email. If
							you need to request a new code, go back to the previous screen and
							select the confirmation method again.
						</p>
						<div style={{ marginTop: '20px' }}>
							<Input
								inputState={inputConfirm}
								setInputState={setInputConfirm}
							/>
						</div>
						<button
							className={
								!inputConfirm.hasValue ? 'submitBtn prev' : 'submitBtn'
							}
							style={{ marginTop: '350px' }}
							type='submit'
							onClick={confirmCodeChecking}
						>
							{!inputConfirm.hasValue ? 'Previous' : 'Next'}
						</button>
					</div>
				</div>
				{/* new password block */}
				<div
					className='resetPasswordContainer'
					style={{ display: activeBlock !== 'newpassword' && 'none' }}
				>
					<div className='formBlockTop'>
						<img className='logoImg' src={PF + 'logo/logo.png'} alt='' />
						<div
							className='crossBlock'
							onClick={() => {
								setActiveForm(false)
								setActiveBlock('name')
							}}
							title='Close'
						>
							<img src={PF + 'icon/utility/x.svg'} alt='' />
						</div>
					</div>
					<div className='formContainer'>
						<h1 className='formTitle' style={{ textAlign: 'left' }}>
							Enter new password
						</h1>
						<p className='formBottomDesc'>
							The password must contain at least 8 characters. To create a
							strong password, use numbers, letters, and punctuation.
						</p>
						<div style={{ marginTop: '20px' }}>
							<Input
								inputState={inputNewPassword}
								setInputState={setInputNewPassword}
							/>
						</div>
						<div style={{ marginTop: '20px' }}>
							<Input
								inputState={inputConfirmNewPassword}
								setInputState={setInputConfirmNewPassword}
							/>
						</div>
						<button
							className={
								!inputNewPassword.hasValue ||
								!inputConfirmNewPassword.hasValue ||
								inputNewPassword.error ||
								inputConfirmNewPassword.error
									? 'submitBtn disabled'
									: 'submitBtn'
							}
							disabled={
								!inputNewPassword.hasValue ||
								!inputConfirmNewPassword.hasValue ||
								inputNewPassword.error ||
								inputConfirmNewPassword.error
									? true
									: false
							}
							style={{ marginTop: '280px' }}
							type='submit'
							onClick={changeUserPassword}
						>
							Change password
						</button>
					</div>
				</div>
				{/* error alert */}
				<div
					className={
						inputEmail.error !== false ||
						inputPassword.error ||
						inputConfirm.error
							? 'formModal active'
							: 'formModal'
					}
				>
					<span>
						{inputEmail.error === 'wrongemail'
							? 'Sorry, we could not find your account.'
							: inputEmail.error === 'emptyfield'
							? 'Enter your email.'
							: inputPassword.error
							? 'Wrong password.'
							: inputConfirm.error && 'Wrong confirmation code'}
					</span>
				</div>
			</div>
			<div
				className='overlay'
				onClick={() => {
					setActiveForm(false)
					setActiveBlock('name')
					setInputEmail(prev => ({
						...prev,
						error: false,
					}))
					setInputPassword(prev => ({
						...prev,
						error: false,
					}))
				}}
			></div>
		</div>
	)
}

export default LoginForm
