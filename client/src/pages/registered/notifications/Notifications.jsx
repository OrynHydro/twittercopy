// importing css file, components, custom and react hooks, navigation router,
// object with arrays that helps to simplify code, user context and axios library
import './notifications.css'

import { Sidebar, TwitterBlue, LogoutForm, LoginForm, Actual, WhoToFollow, VerifiedOrganizations, TwitterCircle, TwitterProfessionals } from '../../../components/index';
import { useContext, useEffect, useState } from 'react';
import { notificationsMainItems } from '../../../helpers/notifications';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NavLink, useLocation } from 'react-router-dom';
import { UserContext } from '../../../context/UserContext';
import { useLocalStorage } from '../../../utils/useLocalStorage';
import axios from 'axios';

const Notifications = ({isLoading, setIsLoading}) => {

    // declaring page location variable using react-router-dom hook

    const location = useLocation()
    
    // declaring states of modal windows

    const [activeTwitterBlue, setActiveTwitterBlue] = useState(false)
    const [activeLogOut, setActiveLogOut] = useState(false)
    const [activeLoginForm, setActiveLoginForm] = useState(false)
    const [activeVerified, setActiveVerified] = useState(false)
    const [activeProfessionals, setActiveProfessionals] = useState(false)
    
    // declaring states of custom input field

    const [activeEdit, setActiveEdit] = useState(false)
    const [activeEditCircle, setActiveEditCircle] = useState(true)
    const [activeEditRec, setActiveEditRec] = useState(false)
    const [activeEditInput, setActiveEditInput] = useState(false)
    const [hasValue, setHasValue] = useState(false)

    // user data states 

    const {user, setUser} = useContext(UserContext)
    const [userInStorage, setUserInStorage] = useLocalStorage("user")
    
    // fetches user from local storage

    useEffect(() => {
        const fetchUser = async () => {
            const findUser = await axios.get(`/users/findByToken/${userInStorage}`)
            setUser(findUser.data)
        }
        fetchUser()
    }, [userInStorage])

    document.title = 'Notifications / Twitter'
    
    // removes scrollbar when modal windows are open

    activeLogOut || activeLoginForm || activeTwitterBlue || activeVerified ? document.body.style.overflowY = 'hidden' : document.body.style.overflowY = 'inherit'
            
            // main page content that switched by switch menu

            const NotificationsAll = () => {
                return (
                            <div className="notificationsMain">
                                <div className="notificationsMainContainer">
                                    <h1 className="notificationsMainTitle">Nothing to see here — yet</h1>
                                    <span className="notificationsMainText">{notificationsMainItems[0].text} </span>
                                    <span className="link">Learn more</span>
                                </div>
                            </div>
                )
            }

            const NotificationsVerified = () => {
                return (
                            <div className="notificationsMain">
                                <div className="notificationsMainContainer">
                                    <h1 className="notificationsMainTitle">Nothing to see here — yet</h1>
                                    <span className="notificationsMainText">{notificationsMainItems[1].text} </span>
                                    <span className="link">Learn more</span>
                                </div>
                            </div>
                )
            }

            const NotificationsMentions = () => {
                return (
                            <div className="notificationsMain">
                                <div className="notificationsMainContainer">
                                    <h1 className="notificationsMainTitle">Nothing to see here — yet</h1>
                                    <span className="notificationsMainText">{notificationsMainItems[2].text} </span>
                                </div>
                            </div>
                )
            }

            return (
                <>
                        <div style={{display: 'flex'}}>
                            
                            {/* sidebar with modal windows' states */}

                            <Sidebar 
                                registered 
                                activeTwitterBlue={activeTwitterBlue} 
                                setActiveTwitterBlue={setActiveTwitterBlue} 
                                activeLogOut={activeLogOut} 
                                setActiveLogOut={setActiveLogOut} 
                                activeLoginForm={activeLoginForm} 
                                setActiveLoginForm={setActiveLoginForm} 
                                activeVerified={activeVerified} 
                                setActiveVerified={setActiveVerified} 
                                setActiveEdit={setActiveEdit}  
                                setActiveProfessionals={setActiveProfessionals}
                                isLoading={isLoading}
                                setIsLoading={setIsLoading}
                                user={user}
                                userInStorage={userInStorage}
                            />
                            {/* switch menu */}
                            <div className="notifications">
                                <div className="notificationsTopbar">
                                    <h1 className="notificationsTopbarTitle">Notifications</h1>
                                    <div className="notificationsTopbarBlock">
                                        <NavLink to='/notifications'>
                                            <div className={location.pathname === '/notifications' ? "notificationsTopbarItem active" : "notificationsTopbarItem"}>
                                                All
                                            </div>
                                        </NavLink>
                                        <NavLink to='/notifications/verified'>
                                            <div className={location.pathname === '/notifications/verified' ? "notificationsTopbarItem active" : "notificationsTopbarItem"}>
                                                Verified
                                            </div>
                                        </NavLink>
                                        <NavLink to='/notifications/mentions'>
                                            <div className={location.pathname === '/notifications/mentions' ? "notificationsTopbarItem active" : "notificationsTopbarItem"}>
                                                Mentions
                                            </div>
                                        </NavLink>
                                    </div>
                                </div>
                                {/* routes to different switch menu pages */}
                                <Routes>
                                    <Route path='/' element={<NotificationsAll />} />
                                    <Route path='/verified' element={<NotificationsVerified />} />
                                    <Route path='/mentions' element={<NotificationsMentions />} />
                                </Routes>
                            </div>
                            {/* rightbar with trends */}
                            <div>  
                                <Actual registered />
                                <WhoToFollow />
                            </div>
                            {/* modal windows */}
                            <TwitterBlue active={activeTwitterBlue} setActive={setActiveTwitterBlue} />
                            <LogoutForm active={activeLogOut} setActive={setActiveLogOut} />
                            <LoginForm activeForm={activeLoginForm} setActiveForm={setActiveLoginForm} />
                            <VerifiedOrganizations active={activeVerified} setActive={setActiveVerified} />
                            <TwitterCircle activeEdit={activeEdit} setActiveEdit={setActiveEdit} activeEditCircle={activeEditCircle} setActiveEditCircle={setActiveEditCircle} activeEditRec={activeEditRec} setActiveEditRec={setActiveEditRec} activeEditInput={activeEditInput} setActiveEditInput={setActiveEditInput} hasValue={hasValue} setHasValue={setHasValue} />
                            <TwitterProfessionals active={activeProfessionals} setActive={setActiveProfessionals} />
                        </div>
                </>
            )
    }


export default Notifications;