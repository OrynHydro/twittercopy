import { useEffect } from 'react'

const Input = ({ inputState, setInputState }) => {
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
		>
			<span
				className='addListInputCounter'
				style={{ display: inputState.active ? 'inline' : 'none' }}
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
				type='text'
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
					inputState.editprofile &&
					!inputState.hasValue &&
					inputState.value?.length === 1
						? ''
						: inputState.value
				}
			/>
		</div>
	)
}

export default Input
