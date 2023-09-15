// importing css file, components, custom and react hooks, user context and axios library

import './messages.css'

import { Sidebar, TwitterBlue, LogoutForm, LoginForm, VerifiedOrganizations, TwitterCircle, TwitterProfessionals } from '../../../components/index';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../context/UserContext';
import { useLocalStorage } from '../../../utils/useLocalStorage';
import axios from 'axios';

const Messages = ({isLoading, setIsLoading}) => {

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
    
    document.title = 'Messages / Twitter'

    // removes scrollbar when modal windows are open

    activeLogOut || activeLoginForm || activeTwitterBlue || activeVerified ? document.body.style.overflowY = 'hidden' : document.body.style.overflowY = 'inherit'

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
    
    // declaring variable that helps to get images from folder directly without importing

    const PF = process.env.REACT_APP_PUBLIC_FOLDER

    return (  
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
            {/* main content in page */}
            <div className="messagesMain">
                <div className="messagesMainContainer">
                    <div className="messagesMainTop">
                        <h2 className="messagesMainTopTitle">Messages</h2>
                        <div className="messagesMainIconsBlock">
                            <div className="messagesMainIconBlock" title='Settings'>
                                <img src={PF + 'icon/common/settings.svg'} alt="" className="messagesMainIcon" />
                            </div>
                            <div className="messagesMainIconBlock" title='New message'>
                                <img src={PF + 'icon/common/message.svg'} alt="" className="messagesMainIcon" />
                            </div>
                        </div>
                    </div>
                    <div className="messagesMainBottom">
                        <h1 className="messagesMainTitle">Welcome to your inbox!</h1>
                        <p className="messagesMainText">Drop a line, share Tweets and more with private conversations between you and others on Twitter. </p>
                        <button className="messagesMainButton">Write a message</button>
                    </div>
                </div>
            </div>
            {/* page specific rightbar */}
            <div className="messagesRight">
                <div className="messagesRightContainer">
                    <h1 className="messagesMainTitle">Select a message</h1>
                    <p className="messagesMainText">Choose from your existing conversations, start a new one, or just keep swimming.</p>
                    <button className="messagesMainButton">New message</button>
                </div>
            </div>
            {/* modal windows */}
            <TwitterBlue active={activeTwitterBlue} setActive={setActiveTwitterBlue} />
            <LogoutForm active={activeLogOut} setActive={setActiveLogOut} />
            <LoginForm activeForm={activeLoginForm} setActiveForm={setActiveLoginForm} />
            <VerifiedOrganizations active={activeVerified} setActive={setActiveVerified} />
            <TwitterCircle activeEdit={activeEdit} setActiveEdit={setActiveEdit} activeEditCircle={activeEditCircle} setActiveEditCircle={setActiveEditCircle} activeEditRec={activeEditRec} setActiveEditRec={setActiveEditRec} activeEditInput={activeEditInput} setActiveEditInput={setActiveEditInput} hasValue={hasValue} setHasValue={setHasValue} />
            <TwitterProfessionals active={activeProfessionals} setActive={setActiveProfessionals} />
        </div>
    );
}

export default Messages;