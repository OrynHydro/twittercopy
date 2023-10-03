// import css, progressbar library and its css, react hook, custom textarea component,
// custom hook, modal window component, navigation component and axios libraty

import './share.css'

import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { useState } from 'react'

import TextareaAutosize from 'react-textarea-autosize'

import { useOutsideClick } from './../../utils/useOutsideClick'

import { TwitterCircle } from './../index'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Share = ({
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
	user,
	postPage,
	originalPost,
}) => {
	// declaring variable that helps to get images from folder directly without importing
	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	// input states

	const [activeInput, setActiveInput] = useState(false)
	const [text, setText] = useState('')

	// modal windows states

	const [activeModal1, setActiveModal1] = useState(false)
	const [activeModal2, setActiveModal2] = useState(false)

	// switch menu states

	const [activeEveryone, setActiveEveryone] = useState(true)
	const [activeCircle, setActiveCircle] = useState(false)

	const [activeSecondEveryone, setActiveSecondEveryone] = useState(true)
	const [activeFollow, setActiveFollow] = useState(false)
	const [activeMention, setActiveMention] = useState(false)

	// opening modal window

	const openModal = e => {
		e.stopPropagation()
		setActiveModal2(true)
	}

	// modal window closing

	const modal1 = useOutsideClick(() => setActiveModal1(false))
	const modal2 = useOutsideClick(() => setActiveModal2(false))

	const percentage = text.length / 2.8

	const navigate = useNavigate()

	const [uploadedFiles, setUploadedFiles] = useState([])

	// making a post

	const newPost = async e => {
		e.preventDefault()
		if (text.length !== 0 || uploadedFiles) {
			try {
				const formData = new FormData()
				const filesArr = []
				const filesIdName = []
				const filesExtentionArr = []

				uploadedFiles.map(file => filesArr.push(file[0]))

				filesArr.map(file => filesExtentionArr.push(file?.name.split('.')[1]))

				filesArr.map(file =>
					filesIdName.push(
						'p' +
							Math.random().toString(16).slice(2) +
							'.' +
							filesExtentionArr[filesArr.indexOf(file)]
					)
				)

				for (let i = 0; i < filesArr.length; i++) {
					formData.append('name', filesIdName[i])
					formData.append('files', filesArr[i])
				}

				await axios.post(`/upload`, formData)

				await axios
					.post(`/posts`, {
						userId: user?._id,
						desc: text,
						img: filesIdName || [],
						user: user,
						originalPost: originalPost,
					})
					.then(async newPost => {
						if (originalPost) {
							await axios.put(`/posts/${originalPost}/reply/${user._id}`, {
								replyId: newPost.data._id,
							})
						}
					})
				document.location.reload()
			} catch (err) {
				console.log(err)
			}
		}
	}

	return (
		// making post form
		<form
			className='homePostBlock'
			onSubmit={newPost}
			style={{ marginTop: postPage ? '0' : '107px' }}
		>
			<div
				className='homePostBlockContainer'
				style={{ paddingBottom: postPage && '18px' }}
			>
				<div
					className='homeUserImgBlock'
					onClick={() => navigate(`/${user.userId}`)}
				>
					<img
						className='homeUserImg'
						src={
							!user?.profilePicture
								? PF + 'icon/noAvatar.png'
								: PF + 'storage/' + user?.profilePicture
						}
					/>
					<div className='imgBlockOverlay' />
				</div>
				{/* who can reply on your post */}
				<div
					className={
						activeInput === false || postPage
							? 'homePostWhoCanReplyBlock'
							: activeInput && activeEveryone
							? 'homePostWhoCanReplyBlock active'
							: activeInput && activeCircle
							? 'homePostWhoCanReplyBlock activeGreen'
							: ''
					}
					onClick={e => {
						e.stopPropagation()
						setActiveModal1(true)
					}}
				>
					<span>
						{activeEveryone ? 'Everyone' : activeCircle ? 'Twitter Circle' : ''}{' '}
					</span>
					<img
						src={
							activeEveryone
								? PF + 'icon/utility/chevronDown.svg'
								: activeCircle && PF + 'icon/utility/chevronDownGreen.svg'
						}
						alt='chevron'
					/>
				</div>
				{/* modal block 1 */}
				<div
					className={
						activeModal1
							? 'homePostWhoCanReplyModal active'
							: 'homePostWhoCanReplyModal'
					}
					ref={modal1}
				>
					<div className='homePostWhoCanReplyModalContainer'>
						<h1>Choose audience</h1>
						<div
							className='homePostWhoCanReplyModalItem'
							onClick={() => {
								setActiveEveryone(true)
								setActiveSecondEveryone(true)
								setActiveFollow(false)
								setActiveMention(false)
								setActiveCircle(false)
								setActiveModal1(false)
							}}
						>
							<div className='leftSideImgBlock everyone'>
								<img src={PF + 'icon/colored/globeWhite.svg'} alt='' />
							</div>
							<span className='homePostWhoCanReplyModalItemTitle'>
								Everyone
							</span>
							<img
								className='checkImg'
								style={{ display: activeEveryone ? 'flex' : 'none' }}
								src={PF + 'icon/common/check.svg'}
								alt=''
							/>
						</div>
						<div
							className='homePostWhoCanReplyModalItem'
							onClick={() => {
								setActiveEveryone(false)
								setActiveCircle(true)
								setActiveSecondEveryone(false)
								setActiveFollow(false)
								setActiveMention(false)
								setActiveCircle(true)
								setActiveModal1(false)
							}}
						>
							<div className='leftSideImgBlock circle'>
								<img src={PF + 'icon/colored/userWhite.svg'} alt='' />
							</div>
							<div className='textBlock'>
								<span className='homePostWhoCanReplyModalItemTitle specialTitle'>
									Twitter Circle
								</span>
								<div className='bottomBlock'>
									<span className='homePostWhoCanReplyModalItemTitle'>0</span>
									<span className='people'>People</span>
									<div
										className='editBlock'
										onClick={() => setActiveEdit(true)}
									>
										Edit
									</div>
								</div>
							</div>
							<img
								className='checkImg'
								style={{ display: activeCircle ? 'flex' : 'none' }}
								src={PF + '/icon/common/check.svg'}
								alt=''
							/>
						</div>
					</div>
				</div>
				{/* input block */}
				<TwitterCircle
					activeEdit={activeEdit}
					setActiveEdit={setActiveEdit}
					activeEditCircle={activeEditCircle}
					setActiveEditCircle={setActiveEditCircle}
					activeEditRec={activeEditRec}
					setActiveEditRec={setActiveEditRec}
					activeEditInput={activeEditInput}
					setActiveEditInput={setActiveEditInput}
					hasValue={hasValue}
					setHasValue={setHasValue}
				/>
				<TextareaAutosize
					className={'homePostBlockInput'}
					style={{
						left: postPage ? '' : activeInput ? '60px' : '',
						top: postPage ? '' : activeInput ? '-25px' : '',
					}}
					placeholder={postPage ? 'Post your reply' : "What's happening?"}
					onClick={() => setActiveInput(true)}
					onChange={e => setText(e.target.value)}
				/>
				<div
					onClick={e => (activeInput && activeEveryone ? openModal(e) : null)}
					disabled={activeCircle ? true : false}
					className={
						activeInput === false || postPage
							? 'homePostWhoCanReplySecondBlock'
							: activeInput && activeEveryone
							? 'homePostWhoCanReplySecondBlock active'
							: activeInput && activeCircle
							? 'homePostWhoCanReplySecondBlock disabled'
							: ''
					}
				>
					<img
						src={
							activeSecondEveryone
								? PF + 'icon/common/globe.svg'
								: activeFollow
								? PF + 'icon/colored/userBlue.svg'
								: activeMention
								? PF + 'icon/common/email.svg'
								: activeCircle
								? PF + 'icon/common/lock.svg'
								: ''
						}
						alt='img'
					/>
					<span>
						{activeSecondEveryone
							? 'Everyone can reply'
							: activeCircle
							? 'Only your Twitter Circle can reply'
							: activeFollow
							? 'People you follow can reply'
							: activeMention
							? 'Only people you mention can reply'
							: ''}
					</span>
				</div>
				{/* choosing images */}
				<div
					className={
						uploadedFiles.length === 2
							? 'previewImage two'
							: uploadedFiles.length === 3
							? 'previewImage three'
							: uploadedFiles.length === 4
							? 'previewImage four'
							: ''
					}
					style={{ display: uploadedFiles.length === 0 && 'none' }}
				>
					{uploadedFiles.map(item => (
						<div
							className={
								uploadedFiles.length === 3 && uploadedFiles.indexOf(item) === 0
									? 'full-height shareImgContainer'
									: (uploadedFiles.length === 3 &&
											uploadedFiles.indexOf(item) === 1) ||
									  uploadedFiles.indexOf(item) === 2
									? 'half-height shareImgContainer'
									: 'shareImgContainer'
							}
							style={{ top: postPage && '0' }}
						>
							<div
								className='imgContainerCrossBlock'
								title='Remove'
								onClick={() =>
									setUploadedFiles(
										uploadedFiles.filter(removed => item !== removed)
									)
								}
							>
								<span>&#10005;</span>
							</div>
							<img
								className='shareImg'
								src={URL.createObjectURL(
									uploadedFiles[uploadedFiles.indexOf(item)][0]
								)}
								alt=''
							/>
						</div>
					))}
				</div>
				{/* modal window 2 */}
				<div
					className={activeModal2 ? 'secondModal active' : 'secondModal'}
					ref={modal2}
				>
					<div className='secondModalContainer'>
						<h1 className='secondModalTitle'>Who can reply?</h1>
						<span className='secondModalText'>
							Choose who can reply to this Tweet. Anyone mentioned can always
							reply.
						</span>
						<div
							className='homePostWhoCanReplyModalItem'
							onClick={() => {
								setActiveFollow(false)
								setActiveMention(false)
								setActiveSecondEveryone(true)
								setActiveModal2(false)
							}}
						>
							<div className='leftSideImgBlock everyone'>
								<img src={PF + 'icon/colored/globeWhite.svg'} alt='' />
							</div>
							<span className='homePostWhoCanReplyModalItemTitle'>
								Everyone
							</span>
							<img
								className='checkImg'
								src={PF + 'icon/common/check.svg'}
								style={{ display: activeSecondEveryone ? 'flex' : 'none' }}
								alt=''
							/>
						</div>
						<div
							className='homePostWhoCanReplyModalItem'
							onClick={() => {
								setActiveFollow(true)
								setActiveMention(false)
								setActiveSecondEveryone(false)
								setActiveModal2(false)
							}}
						>
							<div className='leftSideImgBlock everyone'>
								<img src={PF + 'icon/colored/userWhite.svg'} alt='' />
							</div>
							<span className='homePostWhoCanReplyModalItemTitle'>
								People you follow
							</span>
							<img
								className='checkImg'
								src={PF + 'icon/common/check.svg'}
								style={{ display: activeFollow ? 'flex' : 'none' }}
								alt=''
							/>
						</div>
						<div
							className='homePostWhoCanReplyModalItem'
							onClick={() => {
								setActiveFollow(false)
								setActiveMention(true)
								setActiveSecondEveryone(false)
								setActiveModal2(false)
							}}
						>
							<div className='leftSideImgBlock everyone'>
								<img src={PF + 'icon/colored/emailWhite.svg'} alt='' />
							</div>
							<span className='homePostWhoCanReplyModalItemTitle'>
								Only people you mention
							</span>
							<img
								className='checkImg'
								src={PF + 'icon/common/check.svg'}
								style={{ display: activeMention ? 'flex' : 'none' }}
								alt=''
							/>
						</div>
					</div>
				</div>
				<hr
					className={activeInput ? 'homePostBlockHr active' : 'homePostBlockHr'}
					style={{ display: postPage && 'none' }}
				/>
				{/* bottom icons */}
				<div
					className='homePostBlockIcons'
					onClick={() => setActiveInput(true)}
				>
					<label htmlFor='imgInput' className='homePostBlockIconBlock'>
						<img
							className='homePostBlockIcon'
							src={PF + 'icon/common/image.svg'}
							alt=''
						/>
					</label>
					<input
						type='file'
						id='imgInput'
						onChange={e => setUploadedFiles([...uploadedFiles, e.target.files])}
						multiple
						hidden
					/>
					<div className='homePostBlockIconBlock'>
						<img
							className='homePostBlockIcon'
							src={PF + 'icon/common/gif.png'}
							alt=''
						/>
					</div>
					<div
						className='homePostBlockIconBlock'
						style={{ display: postPage && 'none' }}
					>
						<img
							className='homePostBlockIcon'
							src={PF + 'icon/common/list.svg'}
							alt=''
						/>
					</div>
					<div className='homePostBlockIconBlock'>
						<img
							className='homePostBlockIcon'
							src={PF + 'icon/common/smile.svg'}
							alt=''
						/>
					</div>
					<div
						className={
							activeEveryone === false
								? 'homePostBlockIconBlock disabled'
								: 'homePostBlockIconBlock'
						}
						style={{ display: postPage && 'none' }}
					>
						<img
							className='homePostBlockIcon'
							src={
								activeEveryone === false
									? PF + 'icon/common/calendarDisabled.svg'
									: PF + 'icon/common/calendar.svg'
							}
							alt=''
						/>
					</div>
					<div className='homePostBlockIconBlock disabled' disabled>
						<img
							className='homePostBlockIcon'
							src={PF + 'icon/common/gps.svg'}
							alt=''
						/>
					</div>
				</div>
				<span
					className={
						activeInput && text.length !== 0
							? 'progressBarBlock active'
							: 'progressBarBlock'
					}
					style={{ bottom: postPage && '20px' }}
				>
					<CircularProgressbar value={percentage} />
				</span>
				<button
					type='submit'
					className={
						text.length === 0 && uploadedFiles.length === 0 && postPage
							? 'tweetBtn disabled postPageReplyBtn'
							: postPage
							? 'tweetBtn postPageReplyBtn'
							: text.length === 0 && uploadedFiles.length === 0
							? 'tweetBtn disabled'
							: 'tweetBtn'
					}
					disabled={
						text.length === 0 && uploadedFiles.length === 0 ? true : false
					}
				>
					{postPage ? 'Reply' : 'Tweet'}
				</button>
			</div>
		</form>
	)
}

export default Share
