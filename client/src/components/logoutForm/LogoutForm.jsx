// importing css file, user context, react and custom hooks

import './logoutForm.css'
import { useContext } from 'react'
import { UserContext } from '../../context/UserContext'
import { useLocalStorage } from '../../utils/useLocalStorage'
import { useNavigate } from 'react-router-dom'

const LogoutForm = ({ active, setActive }) => {

    // declaring variable that helps to get images from folder directly without importing

	const PF = process.env.REACT_APP_PUBLIC_FOLDER

    // user data states 

    const {user, setUser} = useContext(UserContext)
    const [userData, setUserData] = useLocalStorage('user')

    // logout user (removes data from local storage)

    const navigate = useNavigate()

    const logoutUser = () => {
        setActive(false); 
        setUser(null); 
        setUserData(null); 
        setTimeout(() =>  {navigate('/'); document.location.reload()}, 1)
    }
    return (  
        <div className={active ? 'logoutForm active' : 'logoutForm'}>
            <div className="logoutFormContainer">
                    <img src={PF + 'logo/logo.png'} alt="" />
                    <h2>Log out of Twitter?</h2>
                    <span>You can always log back in at any time. If you just want to switch accounts, you can do that by adding an existing account.</span>
                    <button className="rightbarTopItem specialItem" onClick={logoutUser}>Log out</button>
                    <button className="rightbarTopItem" onClick={() => setActive(false)}>Cancel</button>
                </div>
            <div className="overlay" onClick={() => setActive(false)}></div>
        </div>
    );
}

export default LogoutForm;