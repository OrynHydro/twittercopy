import { useState } from 'react'
import Input from '../../input/Input'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const CreateListModal = ({
	user,
	activeAddList,
	setActiveAddList,
	addUser,
}) => {
	const [inputName, setInputName] = useState({
		active: false,
		hasValue: false,
		label: '',
		value: '',
		maxCount: 25,
		name: 'Name',
	})

	const [inputDesc, setInputDesc] = useState({
		active: false,
		hasValue: false,
		label: '',
		value: '',
		maxCount: 100,
		name: 'Description',
	})

	const [isChecked, setIsChecked] = useState(false)

	const navigate = useNavigate()

	const listCoverArray = [
		'defaultListCover.png',
		'defaultListCover2.png',
		'defaultListCover3.png',
		'defaultListCover4.png',
	]

	const randomCover = Math.floor(Math.random() * listCoverArray.length)

	const createList = async () => {
		if (!inputName.hasValue) return
		try {
			await axios
				.post(`/lists`, {
					name: inputName.value,
					desc: inputDesc.value,
					creator: user?._id,
					coverPicture: !currentListCover
						? listCoverArray[randomCover]
						: currentListCover,
				})
				.then(res => navigate(`/lists/${res.data._id}`))
		} catch (err) {
			console.log(err)
		}
	}

	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	const [currentListCover, setCurrentListCover] = useState()

	const changeListCover = async e => {
		try {
			const formData = new FormData()
			const fileName =
				'c' +
				Math.random().toString(16).slice(2) +
				'.' +
				e.target.files[0]?.name.split('.')[1]

			formData.append('name', fileName)
			formData.append('files', e.target.files[0])

			await axios.post(`/upload`, formData)

			setCurrentListCover(fileName)
		} catch (err) {
			console.log(err)
		}
	}

	return (
		<div
			className={activeAddList ? 'addListBlock active' : 'addListBlock'}
			// onClick={e => e.preventDefault()}
		>
			<div className='addListBlockContainer'>
				<div className='addListTop'>
					<div className='addListTopLeft'>
						<div
							className='addListCrossBlock'
							onClick={() => {
								setActiveAddList(false)
							}}
						>
							<img
								src={
									addUser
										? PF + 'icon/utility/arrowLeft.svg'
										: PF + 'icon/utility/x.svg'
								}
								alt=''
							/>
						</div>
						<span className='addListTitle'>Create a new List</span>
					</div>
					<button
						disabled={
							!inputName.hasValue && inputName.value.length <= 1 ? true : null
						}
						className={
							!inputName.hasValue && inputName.value.length <= 1
								? 'addListNextBtn disabled'
								: 'addListNextBtn'
						}
						onClick={createList}
					>
						Next
					</button>
				</div>
				{/* list's cover */}
				<div
					className='editProfileBackgroundBlock'
					style={{ position: 'relative' }}
				>
					{currentListCover === null
						? false
						: currentListCover !== undefined && (
								<div className='currentCover'>
									<img
										src={PF + 'storage/' + currentListCover}
										alt=''
										className='coverImg'
									/>
									<div className='currentCoverOverlay'></div>
								</div>
						  )}
					<div className='editProfileBackgroundAddPhotoIcons'>
						<label
							htmlFor='listCover'
							className='editProfileBackgroundAddPhotoBlock'
						>
							<img src={PF + 'icon/common/camera.svg'} alt='' />
						</label>
						<input
							type='file'
							hidden
							id='listCover'
							onChange={e => changeListCover(e)}
						/>
						{!currentListCover
							? false
							: currentListCover && (
									<div
										className='editProfileBackgroundAddPhotoBlock'
										onClick={() => setCurrentListCover()}
									>
										<img src={PF + 'icon/utility/xWhite.svg'} alt='' />
									</div>
							  )}
					</div>
				</div>
				{/* list's name and desc */}
				<div className='addListForm'>
					<Input inputState={inputName} setInputState={setInputName} />

					<Input inputState={inputDesc} setInputState={setInputDesc} />

					<div className='addListRadioInputBlock'>
						<div className='addListRadioInputBlockTextBlock'>
							<span className='addListRadioInputBlockText'>Make private</span>
							<span className='addListRadioInputBlockAddition'>
								When you make a List private, only you can see it.
							</span>
						</div>
						<div className='checkboxBlock'>
							<input
								type='checkbox'
								defaultChecked={isChecked}
								onClick={() => setIsChecked(!isChecked)}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className='overlay' onClick={() => setActiveAddList(false)}></div>
		</div>
	)
}

export default CreateListModal
