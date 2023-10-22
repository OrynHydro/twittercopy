import { useEffect, useState } from 'react'

import './activeChatRight.css'
import { AiOutlineInfoCircle } from 'react-icons/ai'

import TextareaAutosize from 'react-textarea-autosize'
import { PiPaperPlaneRightBold } from 'react-icons/pi'

const ActiveChatRight = ({ chat, user }) => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER
	const [chatMember, setChatMember] = useState(null)

	useEffect(() => {
		if (chat && user) {
			setChatMember(chat.members.find(item => item._id !== user?._id))
		}
	}, [chat, user])

	const [text, setText] = useState('')

	return (
		<div className='activeChatContainer'>
			<div className='activeChatTop'>
				<div className='activeChatTopLeft'>
					<img
						src={
							chat?.profilePicture
								? PF + 'storage/' + chatMember?.profilePicture
								: PF + 'icon/noAvatar.png'
						}
						alt=''
						className='activeChatUserAva'
					/>
					<h2 className='activeChatUsername'>{chatMember?.username}</h2>
				</div>
				<div className='activeChatTopRight'>
					<AiOutlineInfoCircle fontSize={20} />
				</div>
			</div>
			<div className='activeChatMid'></div>
			<div className='activeChatBottom'>
				<div className='activeChatBottomContainer'>
					<div className='activeChatBottomIcons'>
						<div className='activeChatBottomIcon'>
							<img src={PF + 'icon/common/image.svg'} alt='' />
						</div>
						<div className='activeChatBottomIcon'>
							<img src={PF + 'icon/common/gif.png'} alt='' />
						</div>
						<div className='activeChatBottomIcon'>
							<img src={PF + 'icon/common/smile.svg'} alt='' />
						</div>
					</div>
					<TextareaAutosize
						className='activeChatBottomInput'
						type='text'
						onChange={e => setText(e.target.value)}
						placeholder='Start a new message'
					/>
					<div
						className={text ? 'sendMessageBlock' : 'sendMessageBlock disabled'}
					>
						<PiPaperPlaneRightBold
							fontSize={18}
							color={text ? '#37a6f1' : '#93ccf2'}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ActiveChatRight
