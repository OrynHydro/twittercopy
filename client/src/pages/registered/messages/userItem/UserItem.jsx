import './userItem.css'

import { AiOutlineCheck } from 'react-icons/ai'
import { FaUser } from 'react-icons/fa'

const UserItem = ({ chosenUsers, setChosenUsers, item, setText, user }) => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER
	return (
		<div
			className='userItem'
			onClick={() => {
				setChosenUsers(
					chosenUsers.includes(item)
						? chosenUsers.filter(chosenItem => chosenItem !== item)
						: [...chosenUsers, item]
				)
				setText('')
			}}
		>
			<div className='userItemContainer'>
				<img
					src={
						item.profilePicture
							? PF + 'storage/' + item.profilePicture
							: PF + 'icon/noAvatar.png'
					}
					className='userAva'
					alt=''
				/>
				<div className='userItemInfo'>
					<h2 className='userItemInfoUsername'>{item.username}</h2>
					<span className='userItemInfoUserId'>{item.userId}</span>
					{item.following.includes(user?._id) && (
						<span className='userItemFollows'>
							<FaUser fontSize={12} color='var(--gray)' /> Follows you
						</span>
					)}
				</div>
				{chosenUsers.includes(item) && (
					<AiOutlineCheck
						color='var(--blue)'
						style={{ position: 'absolute', right: '20px' }}
					/>
				)}
			</div>
		</div>
	)
}

export default UserItem
