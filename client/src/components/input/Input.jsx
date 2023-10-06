import axios from 'axios'
import { useEffect, useState } from 'react'

const Input = ({ inputState, setInputState }) => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	const handleEmailRegChange = async e => {
		try {
			const dbHasEmail = await axios.get(`/users/findByEmail/${e.target.value}`)
			if (dbHasEmail.data[0]?.email) {
				setInputState(prev => ({
					...prev,
					label: '',
					error: 'dbHasEmail',
				}))
			} else {
				setInputState(prev => ({
					...prev,
					error: false,
				}))
			}
		} catch (err) {
			console.log(err)
		}
	}

	const emailRegValidation = () => {
		if (
			!String(inputState.value)
				.toLowerCase()
				.match(
					/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
				) &&
			inputState.hasValue
		) {
			return 'wrongEmail'
		} else if (inputState.error === 'dbHasEmail') {
			return 'dbHasEmail'
		}
	}

	const handleInputChange = e => {
		setInputState(prev => ({
			...prev,
			hasValue: true,
			value: e.target.value,
		}))
		if (inputState.purpose === 'Emailreg') handleEmailRegChange(e)
	}

	useEffect(() => {
		if (inputState.active) {
			setInputState(prev => ({
				...prev,
				label: 'blue',
			}))
		}
		if (inputState.hasValue && !inputState.active) {
			setInputState(prev => ({
				...prev,
				label: 'gray',
			}))
		}
		if (!inputState.hasValue && !inputState.active) {
			setInputState(prev => ({
				...prev,
				label: '',
			}))
		}
	}, [inputState.active, inputState.hasValue])

	const [hindPassword, setHindPassword] = useState(true)

	return (
		<div
			className={
				inputState.name === 'Description' && inputState.active
					? 'addListInputBlock descInput active'
					: inputState.name === 'Description' && !inputState.active
					? 'addListInputBlock descInput'
					: inputState.name === 'Bio' && inputState.active
					? 'addListInputBlock bioInput active'
					: inputState.name === 'Bio' && !inputState.active
					? 'addListInputBlock bioInput'
					: inputState.active
					? 'addListInputBlock active'
					: 'addListInputBlock'
			}
			onClick={() =>
				setInputState(prev => ({
					...prev,
					active: true,
				}))
			}
			onBlur={() =>
				setInputState(prev => ({
					...prev,
					active: false,
					label: '',
					error:
						(inputState.name === 'Name' && !inputState.hasValue) ||
						(inputState.purpose === 'Passwordreg' &&
							inputState.value.length < 8 &&
							true)
							? true
							: inputState.purpose === 'Emailreg' && emailRegValidation(),
				}))
			}
			style={{
				borderColor: inputState.error && '#F6444F',
			}}
		>
			<span
				className='addListInputCounter'
				style={{
					display: inputState.notCounter
						? 'none'
						: inputState.active
						? 'inline'
						: 'none',
				}}
			>
				{inputState.hasValue === false && inputState.value?.length === 1
					? 0
					: inputState.value?.length}{' '}
				/ {inputState.maxCount}
			</span>
			<span
				className='placeholderText'
				style={{ display: inputState.name !== 'User ID' && 'none' }}
			>
				@
			</span>
			<label
				className={
					inputState.error
						? 'addListLabel active error'
						: inputState.label === 'blue'
						? 'addListLabel activeBlue'
						: inputState.label === 'gray'
						? 'addListLabel active'
						: inputState.name !== 'User ID'
						? 'addListLabel'
						: 'addListLabel active'
				}
				htmlFor={inputState.name}
			>
				{inputState.name}
			</label>
			<input
				maxLength={inputState.maxLength}
				id={inputState.name}
				type={
					inputState.name === 'Email'
						? 'email'
						: (inputState.name === 'Password' && hindPassword) ||
						  (inputState.name === 'New password' && hindPassword) ||
						  (inputState.name === 'Confirm new password' && hindPassword)
						? 'password'
						: 'text'
				}
				className={
					inputState.name === 'User ID'
						? 'addListInput inputWithPlaceholder'
						: 'addListInput'
				}
				onChange={e =>
					e.target.value
						? handleInputChange(e)
						: setInputState(prev => ({
								...prev,
								hasValue: false,
						  }))
				}
				value={
					!inputState.hasValue && inputState.value?.length === 1
						? ''
						: inputState.value
				}
			/>
			<div
				className='hindPasswordBlock'
				onClick={() => setHindPassword(!hindPassword)}
				title='Reveal password'
				style={{
					display:
						inputState.name !== 'Password' &&
						inputState.name !== 'New password' &&
						inputState.name !== 'Confirm new password' &&
						'none',
				}}
			>
				<img
					src={
						hindPassword
							? PF + 'icon/utility/eye.svg'
							: PF + 'icon/utility/eye-off.svg'
					}
					alt=''
				/>
			</div>
		</div>
	)
}

export default Input
