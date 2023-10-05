import { useEffect, useState } from 'react'

const Input = ({ inputState, setInputState }) => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	const handleInputChange = e => {
		setInputState(prev => ({
			...prev,
			hasValue: true,
			value: e.target.value,
		}))
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
				}))
			}
			style={{
				borderColor:
					(inputState.name === 'New password' && inputState.error) ||
					(inputState.name === 'Confirm new password' && inputState.error)
						? '#F6444F'
						: undefined,
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
			<label
				className={
					inputState.label === 'blue'
						? 'addListLabel activeBlue'
						: inputState.label === 'gray'
						? 'addListLabel active'
						: 'addListLabel'
				}
				htmlFor='input'
			>
				{inputState.name}
			</label>
			<input
				maxLength={inputState.maxLength}
				id='input'
				type={
					inputState.name === 'Email'
						? 'email'
						: (inputState.name === 'Password' && hindPassword) ||
						  (inputState.name === 'New password' && hindPassword) ||
						  (inputState.name === 'Confirm new password' && hindPassword)
						? 'password'
						: 'text'
				}
				className='addListInput'
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
