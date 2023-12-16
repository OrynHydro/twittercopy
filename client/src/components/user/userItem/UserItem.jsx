import './userItem.css'

import { AiOutlineCheck } from 'react-icons/ai'
import { FaUser } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const UserItem = ({
	chosenUsers,
	setChosenUsers,
	item,
	setText,
	user,
	isLink,
}) => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER
	return (
		<Link
			className='userItem'
			onClick={() => {
				if (chosenUsers) {
					setChosenUsers(
						chosenUsers.includes(item)
							? chosenUsers.filter(chosenItem => chosenItem !== item)
							: [...chosenUsers, item]
					)
					setText('')
				}
			}}
			to={isLink && `/${item?.userId}`}
		>
			<div className='userItemContainer'>
				<img
					src={
						item?.profilePicture
							? PF + 'storage/' + item?.profilePicture
							: PF + 'icon/noAvatar.png'
					}
					className='userAva'
					alt=''
				/>
				<div className='userItemInfo'>
					<h2 className='userItemInfoUsername'>{item?.username}</h2>
					<span className='userItemInfoUserId'>{item?.userId}</span>
					{item?.followers.includes(user?._id) &&
					item?.following.includes(user?._id) ? (
						<span className='userItemFollows'>
							<FaUser fontSize={12} color='var(--gray)' /> You follow each other
						</span>
					) : item?.following.includes(user?._id) ? (
						<span className='userItemFollows'>
							<FaUser fontSize={12} color='var(--gray)' /> Follows you
						</span>
					) : (
						item?.followers.includes(user?._id) && (
							<span className='userItemFollows'>
								<FaUser fontSize={12} color='var(--gray)' /> You follow
							</span>
						)
					)}
				</div>
				{chosenUsers?.includes(item) && (
					<AiOutlineCheck
						color='var(--blue)'
						style={{ position: 'absolute', right: '20px' }}
					/>
				)}
			</div>
		</Link>
	)
}

export default UserItem
