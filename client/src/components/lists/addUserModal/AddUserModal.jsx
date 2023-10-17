import { useEffect, useState } from 'react'
import './addUserModal.css'
import CreateListModal from '../createListModal/CreateListModal'
import axios from 'axios'
import PostsLoader from '../../posts/postsLoader/PostsLoader'
import ListItem from '../listItem/ListItem'

const AddUserModal = ({ active, setActive, user, postAuthor }) => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	const [activeAddList, setActiveAddList] = useState(false)

	const [userLists, setUserLists] = useState([])

	const [isLoadingLists, setIsLoadingLists] = useState(true)

	const [chosenLists, setChosenLists] = useState([])
	const fetchUserLists = async () => {
		await axios
			.get(`/lists/createdLists/${user._id}`)
			.then(res => {
				const createdLists = res.data.createdLists
				if (createdLists?.length === 0) {
					setUserLists(undefined)
				} else {
					setUserLists(createdLists)
					setChosenLists(
						createdLists.filter(list => list.members.includes(postAuthor))
					)
					console.log(
						createdLists.filter(list => list.members.includes(postAuthor))
					)
				}
			})
			.catch(() => setUserLists(undefined))
		setIsLoadingLists(false)
	}

	useEffect(() => {
		const fetchData = async () => {
			if (active && userLists?.length === 0) {
				await fetchUserLists()
			}
		}

		fetchData()
	}, [active, userLists?.length])

	const addUserToList = () => {
		chosenLists.map(
			async list =>
				await axios.put(`/lists/addToList/${list}`, {
					userDbId: postAuthor,
				})
		)
	}

	return activeAddList ? (
		<CreateListModal
			user={user}
			activeAddList={activeAddList}
			setActiveAddList={setActiveAddList}
			addUser
		/>
	) : (
		<div
			className={active ? 'addUserModal active' : 'addUserModal'}
			onClick={e => e.preventDefault()}
		>
			<div className='addUserModalBlock'>
				<div className='addUserModalTop'>
					<div className='addListTopLeft'>
						<div className='addListCrossBlock' onClick={() => setActive(false)}>
							<img src={PF + 'icon/utility/x.svg'} alt='' />
						</div>
						<span className='addListTitle'>Pick a List</span>
					</div>
					<button
						disabled={chosenLists.length === 0 ? true : null}
						className={
							chosenLists.length === 0
								? 'addListNextBtn disabled'
								: 'addListNextBtn'
						}
						onClick={addUserToList}
					>
						Save
					</button>
				</div>

				<div
					className='createNewListBlock'
					onClick={() => {
						setActiveAddList(true)
					}}
				>
					Create a new List
				</div>
				<hr className='postPageHr' style={{ width: '600px' }} />
				{userLists === undefined ? (
					<p className='profileListsText'>
						You haven't created or followed any Lists. When you do, they'll show
						up here.
					</p>
				) : isLoadingLists ? (
					<PostsLoader />
				) : (
					userLists.map((list, index) => (
						<ListItem
							list={list}
							key={index}
							user={user}
							addUser
							setActiveAddUser={setActive}
							chosenLists={chosenLists}
							setChosenLists={setChosenLists}
						/>
					))
				)}
			</div>
			<div className='overlay' onClick={() => setActive(false)} />
		</div>
	)
}

export default AddUserModal
