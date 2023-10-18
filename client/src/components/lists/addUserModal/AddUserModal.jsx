import { useEffect, useState } from 'react'
import './addUserModal.css'
import CreateListModal from '../createListModal/CreateListModal'
import axios from 'axios'
import PostsLoader from '../../posts/postsLoader/PostsLoader'
import ListItem from '../listItem/ListItem'

const AddUserModal = ({ active, setActive, user, post }) => {
	const PF = process.env.REACT_APP_PUBLIC_FOLDER

	const [activeAddList, setActiveAddList] = useState(false)

	const [userLists, setUserLists] = useState([])
	const [isLoadingLists, setIsLoadingLists] = useState(true)

	const [chosenLists, setChosenLists] = useState([])

	const [postAuthorMemberLists, setPostAuthorMemberLists] = useState([])

	const [loadingBtn, setLoadingBtn] = useState(false)

	useEffect(() => {
		const fetchUserLists = async () => {
			await axios
				.get(`/lists/createdLists/${user?._id}`)
				.then(res => {
					const createdLists = res.data.createdLists
					if (createdLists?.length === 0) {
						setUserLists(undefined)
					} else {
						setUserLists(createdLists)
						setChosenLists(
							createdLists
								.filter(list => list.members.includes(post.user?._id))
								.map(list => list?._id)
						)
						setPostAuthorMemberLists(
							createdLists
								.filter(list => list.members.includes(post.user?._id))
								.map(list => list?._id)
						)
					}
				})
				.catch(() => setUserLists(undefined))
			setIsLoadingLists(false)
		}
		if (active && userLists?.length === 0 && user?._id) {
			fetchUserLists()
		}
	}, [active, userLists?.length, user?._id])

	const addUserToList = async () => {
		if (arraysAreEqual(postAuthorMemberLists, chosenLists)) return
		setLoadingBtn(true)
		try {
			const differentElements1 = postAuthorMemberLists.filter(
				list => !chosenLists.includes(list)
			)

			const differentElements2 = chosenLists.filter(
				list => !postAuthorMemberLists.includes(list)
			)

			for (const list of differentElements1) {
				await axios.put(`/lists/addToList/${list}`, {
					userDbId: post.user?._id,
				})
			}

			for (const list of differentElements2) {
				await axios.put(`/lists/addToList/${list}`, {
					userDbId: post.user?._id,
				})
			}
			document.location.reload()
		} catch (error) {
			console.log(error)
		}
		setLoadingBtn(false)
	}

	function arraysAreEqual(arr1, arr2) {
		if (arr1.length !== arr2.length) {
			return false
		}

		const sortedArr1 = arr1.slice().sort()
		const sortedArr2 = arr2.slice().sort()

		for (let i = 0; i < sortedArr1.length; i++) {
			if (sortedArr1[i] !== sortedArr2[i]) {
				return false
			}
		}

		return true
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
						disabled={arraysAreEqual(
							postAuthorMemberLists,
							chosenLists ? true : null
						)}
						className={
							loadingBtn
								? 'addListNextBtn loadingBtn'
								: arraysAreEqual(postAuthorMemberLists, chosenLists)
								? 'addListNextBtn disabled'
								: 'addListNextBtn'
						}
						onClick={addUserToList}
					>
						<span>Save</span>
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
							activeAddUser={active}
						/>
					))
				)}
			</div>
			<div className='overlay' onClick={() => setActive(false)} />
		</div>
	)
}

export default AddUserModal
