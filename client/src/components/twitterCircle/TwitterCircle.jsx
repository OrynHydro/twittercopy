// import css and react hook

import './twitterCircle.css'
import { useRef } from 'react'

const TwitterCircle = ({
	activeEdit,
	setActiveEdit,
	activeEditCircle,
	setActiveEditCircle,
	activeEditRec,
	setActiveEditRec,
	activeEditInput,
	setActiveEditInput,
	hasValue,
	setHasValue,
}) => {
	// declaring variable that helps to get images from folder directly without importing

	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	const input = useRef()
	return (
		// opens as modal window when state is true
		<div className={activeEdit ? 'editBlockModal active' : 'editBlockModal'}>
			<div className='editBlockModalContainer'>
				<div className='editBlockModalTop'>
					<h1>Edit your Twitter Circle</h1>
					<div
						className='crossBlock'
						onClick={() => {
							setActiveEdit(false)
							setActiveEditCircle(true)
							setActiveEditRec(false)
						}}
						title='Close'
					>
						<img src={PF + 'icon/utility/x.svg'} alt='' />
					</div>
				</div>
				{/* switch menu */}
				<div className='editBlockModalMid'>
					<div
						className={
							activeEditCircle
								? 'editBlockModalItem active'
								: 'editBlockModalItem'
						}
						onClick={() => {
							setActiveEditCircle(true)
							setActiveEditRec(false)
						}}
					>
						Twitter Circle
					</div>
					<div
						className={
							activeEditRec ? 'editBlockModalItem active' : 'editBlockModalItem'
						}
						onClick={() => {
							setActiveEditCircle(false)
							setActiveEditRec(true)
						}}
					>
						Recommended
					</div>
				</div>
				{/* search block */}
				<div
					className='editBlockModalInputBlock'
					style={{
						display: activeEditCircle ? 'none' : 'flex',
						borderColor: activeEditInput ? '#1D9BF0' : '#D8E0E4',
					}}
				>
					<img className='search' src={PF + 'icon/utility/search.svg'} alt='' />
					<input
						className='editBlockModalInput'
						autoFocus
						ref={input}
						onChange={e =>
							e.target.value !== ''
								? setHasValue(true)
								: e.target.value === ''
								? setHasValue(false)
								: false
						}
						onClick={() => setActiveEditInput(true)}
						onBlur={() => setActiveEditInput(false)}
						placeholder='Search people'
					/>
					<img
						className='xCircle'
						onClick={() => (input.current.value = '')}
						style={{ display: hasValue ? 'block' : 'none' }}
						src={PF + 'icon/utility/xCircle.svg'}
						alt=''
					/>
				</div>
				<div className='editBlockModalText'>
					People won’t be notified when you edit your Twitter Circle. Anyone you
					add will be able to see your previous Twitter Circle Tweets.
					<span>How it works</span>
				</div>
				<h1 className='editBlockModalTitle'>
					{activeEditRec
						? 'You don’t have any recommendations — yet'
						: 'There isn’t anyone in your Twitter Circle — yet'}
				</h1>
				<p className='editBlockModalDesc'>
					{activeEditRec
						? 'We’ll suggest people to add to your Twitter Circle here.'
						: 'When you add people, they’ll show up here.'}
				</p>
			</div>
			<div className='overlay' onClick={() => setActiveEdit(false)}></div>
		</div>
	)
}

export default TwitterCircle
