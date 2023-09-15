// importing css file, navigation components, react and custom hooks, user contex, axios and emailjs libraries

import './loginForm.css'

import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'

import axios from 'axios'
import { UserContext } from '../../context/UserContext'

import emailjs from '@emailjs/browser'
import { useLocalStorage } from '../../utils/useLocalStorage'

const LoginForm = ({activeForm, setActiveForm}) => {
    
    // declaring variable that helps to get images from folder directly without importing

    const PF = process.env.REACT_APP_PUBLIC_FOLDER

    // declaring active block state

    const [activeBlock, setActiveBlock] = useState('name')
    
    // declaring states of custom input fields

    const [activeInputEmail, setActiveInputEmail] = useState(false)
    const [hasValueEmail, setHasValueEmail] = useState(false)
    const [activeLabelBlueEmail, setActiveLabelBlueEmail] = useState(false)
    const [activeLabelGrayEmail, setActiveLabelGrayEmail] = useState(false)
    const [valueEmail, setValueEmail] = useState('')
    const [activeErrorEmail, setActiveErrorEmail] = useState(false)
    const [loadingBtnEmail, setLoadingBtnEmail] = useState(false)
    
    const [activeInputPassword, setActiveInputPassword] = useState(false)
    const [hasValuePassword, setHasValuePassword] = useState(false)
    const [activeLabelBluePassword, setActiveLabelBluePassword] = useState(false)
    const [activeLabelGrayPassword, setActiveLabelGrayPassword] = useState(false)
    const [valuePassword, setValuePassword] = useState('')
    const [activeErrorPassword, setActiveErrorPassword] = useState(false)
    const [hindPassword, setHindPassword] = useState(true)
    const [loadingBtnPassword, setLoadingBtnPassword] = useState(false)
    
    const [activeInputConfirm, setActiveInputConfirm] = useState(false)
    const [hasValueConfirm, setHasValueConfirm] = useState(false)
    const [activeLabelBlueConfirm, setActiveLabelBlueConfirm] = useState(false)
    const [activeLabelGrayConfirm, setActiveLabelGrayConfirm] = useState(false)
    const [valueConfirm, setValueConfirm] = useState('')
    const [activeErrorConfirm, setActiveErrorConfirm] = useState(false)
    
    const [activeInputNewPassword, setActiveInputNewPassword] = useState(false)
    const [hasValueNewPassword, setHasValueNewPassword] = useState(false)
    const [activeLabelBlueNewPassword, setActiveLabelBlueNewPassword] = useState(false)
    const [activeLabelGrayNewPassword, setActiveLabelGrayNewPassword] = useState(false)
    const [valueNewPassword, setValueNewPassword] = useState('')
    const [activeErrorNewPassword, setActiveErrorNewPassword] = useState(false)
    const [hindNewPassword, setHindNewPassword] = useState(true)
    
    const [activeInputConfirmNewPassword, setActiveInputConfirmNewPassword] = useState(false)
    const [hasValueConfirmNewPassword, setHasValueConfirmNewPassword] = useState(false)
    const [activeLabelBlueConfirmNewPassword, setActiveLabelBlueConfirmNewPassword] = useState(false)
    const [activeLabelGrayConfirmNewPassword, setActiveLabelGrayConfirmNewPassword] = useState(false)
    const [valueConfirmNewPassword, setValueConfirmNewPassword] = useState('')
    const [activeErrorConfirmNewPassword, setActiveErrorConfirmNewPassword] = useState(false)
    const [hindConfirmNewPassword, setHindConfirmNewPassword] = useState(true)

    // user data states 

    const {user, setUser} = useContext(UserContext)
    const [userInStorage, setUserInStorage] = useLocalStorage('user')
    
    // changes states of custom inputs

    useEffect(() => {
        if(activeInputEmail) {
            setActiveLabelBlueEmail(true)
            setActiveLabelGrayEmail(false)
        } 
        if(hasValueEmail && !activeInputEmail) {
            setActiveLabelGrayEmail(true)
            setActiveLabelBlueEmail(false)
        } 
        if(!hasValueEmail && !activeInputEmail) {
            setActiveLabelGrayEmail(false)
            setActiveLabelBlueEmail(false)
        } 
        !hasValueEmail && valueEmail && setValueEmail('')
    }, [activeInputEmail, hasValueEmail, valueEmail])

    useEffect(() => {
        if(activeInputPassword) {
            setActiveLabelBluePassword(true)
            setActiveLabelGrayPassword(false)
        } 
        if(hasValuePassword && !activeInputPassword) {
            setActiveLabelGrayPassword(true)
            setActiveLabelBluePassword(false)
        } 
        if(!hasValuePassword && !activeInputPassword) {
            setActiveLabelGrayPassword(false)
            setActiveLabelBluePassword(false)
        } 
    }, [activeInputPassword, hasValuePassword])
    
    useEffect(() => {
        if(activeInputConfirm) {
            setActiveLabelBlueConfirm(true)
            setActiveLabelGrayConfirm(false)
        } 
        if(hasValueConfirm && !activeInputConfirm) {
            setActiveLabelGrayConfirm(true)
            setActiveLabelBlueConfirm(false)
        } 
        if(!hasValueConfirm && !activeInputConfirm) {
            setActiveLabelGrayConfirm(false)
            setActiveLabelBlueConfirm(false)
        } 
    }, [activeInputConfirm, hasValueConfirm])
    
    useEffect(() => {
        if(activeInputNewPassword) {
            setActiveLabelBlueNewPassword(true)
            setActiveLabelGrayNewPassword(false)
        } 
        if(hasValueNewPassword && !activeInputNewPassword) {
            setActiveLabelGrayNewPassword(true)
            setActiveLabelBlueNewPassword(false)
        } 
        if(!hasValueNewPassword && !activeInputNewPassword) {
            setActiveLabelGrayNewPassword(false)
            setActiveLabelBlueNewPassword(false)
        } 
    }, [activeInputNewPassword, hasValueNewPassword])
    
    useEffect(() => {
        if(activeInputConfirmNewPassword) {
            setActiveLabelBlueConfirmNewPassword(true)
            setActiveLabelGrayConfirmNewPassword(false)
        } 
        if(hasValueConfirmNewPassword && !activeInputConfirmNewPassword) {
            setActiveLabelGrayConfirmNewPassword(true)
            setActiveLabelBlueConfirmNewPassword(false)
        } 
        if(!hasValueConfirmNewPassword && !activeInputConfirmNewPassword) {
            setActiveLabelGrayConfirmNewPassword(false)
            setActiveLabelBlueConfirmNewPassword(false)
        } 
    }, [activeInputConfirmNewPassword, hasValueConfirmNewPassword])

    const handleInputChange = (e, type) => {
        if(type === 'email') {
            setHasValueEmail(true)
            setValueEmail(e.target.value)
        }
        if(type === 'password') {
            setHasValuePassword(true)
            setValuePassword(e.target.value)
        }
        if(type === 'confirm') {
            setHasValueConfirm(true)
            setValueConfirm(e.target.value)
        }
        if(type === 'newpassword') {
            setHasValueNewPassword(true)
            setValueNewPassword(e.target.value)
        }
        if(type === 'confirmnewpassword') {
            setHasValueConfirmNewPassword(true)
            setValueConfirmNewPassword(e.target.value)
        }
    }
    
    // changes states of custom inputs on click outside it

    const handleEmailOnBlur = () => {
        setActiveInputEmail(false)
        setActiveLabelBlueEmail(false)
    }
    
    const handlePasswordOnBlur = () => {
        setActiveInputPassword(false)
        setActiveLabelBluePassword(false)
    }
    
    const handleConfirmOnBlur = () => {
        setActiveInputConfirm(false)
        setActiveLabelBlueConfirm(false)
    }
    
    const handleNewPasswordOnBlur = () => {
        setActiveInputNewPassword(false)
        setActiveLabelBlueNewPassword(false)
        if(valueNewPassword.length < 8) {
            setActiveErrorNewPassword('minlength')
        } else {
            setActiveErrorNewPassword(false)
        }
    }
    
    const handleConfirmNewPasswordOnBlur = () => {
        setActiveInputConfirmNewPassword(false)
        setActiveLabelBlueConfirmNewPassword(false)
        if(valueConfirmNewPassword.length < 8) {
            setActiveErrorConfirmNewPassword('minlength')
        } else if(valueNewPassword !== valueConfirmNewPassword) {
            setActiveErrorConfirmNewPassword('dontmatch')
        } else {
            setActiveErrorConfirmNewPassword(false)
        }
    }

    // validates email if exists in db or if the field is empty

    const handleEmailButtonClick = async () => {
        setLoadingBtnEmail(true)
        if(hasValueEmail) {
            setActiveErrorEmail(false)
            const dbHasEmail = await axios.get(`/users/findByEmail/${valueEmail}`)
            if(!dbHasEmail?.data[0]?.email) {
                setActiveErrorEmail('wrongemail')
                setTimeout(() => setActiveErrorEmail(false), 5000)
            } else {
                setActiveErrorEmail(false)
                setActiveBlock('password')
            } 
            setLoadingBtnEmail(false)
        } else {
            setActiveErrorEmail('emptyfield')
            setTimeout(() => setActiveErrorEmail(false), 5000)
            setLoadingBtnEmail(false)
        }
    }

    // variable in useNavigate react-router-dom hook

    const navigate = useNavigate()

    // logins user

    const loginUser = async () => {
        setLoadingBtnPassword(true)
        try {
            const userData = {
                email: valueEmail,
                password: valuePassword,
            }
            const newCurrentUser = await axios.get(`/users/findByEmail/${valueEmail}`)
            await axios.post('/auth/login', userData)
            setUserInStorage(newCurrentUser.data[0].token)
            setTimeout(() => {navigate('/')}, 1000)
            setTimeout(() => {document.location.reload();}, 1001)
            // document.location.reload(); navigate('/')
            setLoadingBtnPassword(false)
            setActiveErrorPassword(false)
        } catch {
            setActiveErrorPassword(true)
            setLoadingBtnPassword(false)
            setTimeout(() => setActiveErrorPassword(false), 5000)
        }
    }

    // reset password functions

    const [resetPassCode, setResetPassCode] = useState('')

    const templateParams = {
        user_email: valueEmail,
        resetPass_code: ''
    }

    const handleSendResetPassCode = async () => {
        if(hasValueEmail) {
            genConfirmCode()
            setActiveBlock('loader')
            templateParams.resetPass_code && emailjs.send('service_c5q7g9f', 'template_a6fwsnh', templateParams, 'NBl5OvfBt04mNHzTi')
            .then(() => {
                setResetPassCode(templateParams.resetPass_code)
                console.log(templateParams.resetPass_code)
                setActiveBlock('enterresetpass')
            })
        }
    }

    // generates confirm code

    const genConfirmCode = () => {
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const codeLength = 5;
        let code = ''
        for (let i = 0; i <= codeLength; i++) {
            let randomNumber = Math.floor(Math.random() * chars.length);
            code += chars.substring(randomNumber, randomNumber +1);
        }
        templateParams.resetPass_code = code
    }

    // checks if code is correct

    const confirmCodeChecking = () => {
        if(!hasValueConfirm) setActiveBlock('resetpass')
        else if(resetPassCode === valueConfirm) {
            setActiveBlock('newpassword')
            setActiveErrorConfirm(false)
        } else if(resetPassCode !== valueConfirm) {
            setActiveErrorConfirm(true)
            setTimeout(() => setActiveErrorConfirm(false), 5000)
        }
    }

    // changes user's password

    const changeUserPassword = async () => {
        if(hasValueNewPassword && hasValueConfirmNewPassword && !activeErrorNewPassword & !activeErrorConfirmNewPassword) {
            try {
                await axios.put(`/users/${valueEmail}`, {
                    password: valueNewPassword
                })
                const newCurrentUser = await axios.get(`/users/findByEmail/${valueEmail}`)
                setUser(newCurrentUser.data[0])
                navigate('/')
                document.location.reload()
            } catch(err) {
                console.log(err)
            }
        }
    }

    return (  
        <div className={activeForm ? 'loginForm active' : 'loginForm'}>
                <div className="formBlock">
                    {/* block with email input */}
                    <div style={{display: activeBlock !== 'name' && 'none'}}>
                        <div className="formBlockTop">
                            <img className='logoImg' src={PF + 'logo/logo.png'} alt="" />
                            <div className="crossBlock" onClick={() => {setActiveForm(false); setActiveBlock('name'); setActiveErrorEmail(false); setActiveErrorPassword(false)}} title='Close'>
                                <img src={PF + 'icon/utility/x.svg'} alt="" />
                            </div>
                        </div>
                        <div className="formContainer">
                            <h1 className="formTitle">Sign in to Twitter</h1>
                            <div className="rightbarTopItem">Sign in</div>
                            <div className="rightbarTopItem">Sign in</div>
                            <div className='orBlock'>or</div>
                            <div className={activeInputEmail ? 'addListInputBlock Input active' : 'addListInputBlock Input'} style={{marginTop: '20px'}} onClick={() => setActiveInputEmail(true)} onBlur={handleEmailOnBlur}>
                                <label className={activeLabelBlueEmail ? 'addListLabel activeBlue' : activeLabelGrayEmail ? 'addListLabel active' : 'addListLabel'} htmlFor="email">Email</label>
                                <input id='emailInput' type="text" className="addListInput" onChange={(e) => e.target.value ? handleInputChange(e, 'email') : setHasValueEmail(false)} />
                            </div>
                            <div className={loadingBtnEmail ? "rightbarTopItem specialItem button loadingBtn" : "rightbarTopItem specialItem button"} onClick={handleEmailButtonClick}>
                                <span>
                                    Next
                                </span>
                            </div>
                            <div className="rightbarTopItem specialItemWhite">Forgot password</div>
                            <span className='formSignUp'>Don't have an account? <Link>Sign up</Link></span>
                        </div>
                    </div>
                    {/* block with password input */}
                    <div className="passwordContainer" style={{display: activeBlock !== 'password' && 'none'}}>
                        <div className="formBlockTop">
                            <img className='logoImg' src={PF + 'logo/logo.png'} alt="" />
                            <div className="crossBlock" onClick={() => {setActiveForm(false); setActiveBlock('name')}} title='Close'>
                                <img src={PF + 'icon/utility/x.svg'} alt="" />
                            </div>
                        </div>
                        <div className="formContainer">
                            <h1 className="formTitle" style={{textAlign: 'left'}}>Enter your password</h1>
                            <div className='addListInputBlock disabled' style={{marginTop: '20px'}}>
                                <label className='addListLabel active' style={{cursor: 'default'}}>Email</label>
                                <input disabled value={valueEmail} type="text" className="addListInput"/>
                            </div>
                            <div className={activeInputPassword ? 'addListInputBlock active' : 'addListInputBlock'} style={{marginTop: '20px'}} onClick={() => setActiveInputPassword(true)} onBlur={handlePasswordOnBlur}>
                                <label className={activeLabelBluePassword ? 'addListLabel activeBlue' : activeLabelGrayPassword ? 'addListLabel active' : 'addListLabel'} htmlFor="passwordInput">Password</label>
                                <input id='passwordInput' type={hindPassword ? "password" : "text"} className="addListInput nameInput" onChange={(e) => e.target.value ? handleInputChange(e, 'password') : setHasValuePassword(false)} />
                                <div className="hindPasswordBlock" onClick={() => setHindPassword(!hindPassword)} title='Reveal password'>
                                    <img src={hindPassword ? PF + 'icon/utility/eye.svg' : PF + 'icon/utility/eye-off.svg'} alt="" />
                                </div>
                            </div>
                            <span className='link' onClick={() => setActiveBlock('resetpass')}>Forgot password?</span>
                            <button className={hasValuePassword && loadingBtnPassword ? 'submitBtn loading' : hasValuePassword ? 'submitBtn' : 'submitBtn disabled'} disabled={hasValuePassword ? false : true} style={{margin: '270px 0 20px'}} onClick={loginUser}>
                                <span>
                                    Log in
                                </span>
                            </button>
                            <span className='signupBtn'>Don't have an account? <span className='link'>Sign up</span></span>
                        </div>
                    </div>
                    {/* reset password block */}
                    <div className="resetPasswordContainer" style={{display: activeBlock !== 'resetpass' && 'none'}}>
                        <div className="formBlockTop">
                            <img className='logoImg' src={PF + 'logo/logo.png'} alt="" />
                            <div className="crossBlock" onClick={() => {setActiveForm(false); setActiveBlock('name')}} title='Close'>
                                <img src={PF + 'icon/utility/x.svg'} alt="" />
                            </div>
                        </div>
                        <div className="formContainer">
                            <h1 className="formTitle" style={{textAlign: 'left'}}>Find your account in Twitter</h1>
                            <p className="formBottomDesc">To change your password, enter the email, associated with your account.</p>
                            <div className={activeInputEmail ? 'addListInputBlock Input active' : 'addListInputBlock Input'} style={{marginTop: '20px'}} onClick={() => setActiveInputEmail(true)} onBlur={handleEmailOnBlur}>
                                <label className={activeLabelBlueEmail ? 'addListLabel activeBlue' : activeLabelGrayEmail ? 'addListLabel active' : 'addListLabel'} htmlFor="email">Email</label>
                                <input id='email' value={valueEmail} type="text" className="addListInput" onChange={(e) => e.target.value ? handleInputChange(e, 'email') : setHasValueEmail(false)} />
                            </div>
                            <button className={!hasValueEmail ? 'submitBtn disabled' : 'submitBtn'} disabled={!hasValueEmail} style={{marginTop: '350px'}} type='submit' onClick={handleSendResetPassCode}>Next</button>
                        </div>
                    </div>
                    {/* loading spinner */}
                    <div className="loader" style={{display: activeBlock !== 'loader' && 'none'}} />
                    {/* confirmation code block */}
                    <div className="resetPasswordContainer" style={{display: activeBlock !== 'enterresetpass' && 'none'}}>
                        <div className="formBlockTop">
                            <img className='logoImg' src={PF + 'logo/logo.png'} alt="" />
                            <div className="crossBlock" onClick={() => {setActiveForm(false); setActiveBlock('name')}} title='Close'>
                                <img src={PF + 'icon/utility/x.svg'} alt="" />
                            </div>
                        </div>
                        <div className="formContainer">
                            <h1 className="formTitle" style={{textAlign: 'left'}}>We have sent you a code</h1>
                            <p className="formBottomDesc">Check to see if the confirmation code arrived in your email. If you need to request a new code, go back to the previous screen and select the confirmation method again.</p>
                            <div className={activeInputConfirm ? 'addListInputBlock Input active' : 'addListInputBlock Input'} style={{marginTop: '20px'}} onClick={() => setActiveInputConfirm(true)} onBlur={handleConfirmOnBlur}>
                                <label className={activeLabelBlueConfirm ? 'addListLabel activeBlue' : activeLabelGrayConfirm ? 'addListLabel active' : 'addListLabel'} htmlFor="confirm">Confirmation code</label>
                                <input id='confirmInput' type="text" className="addListInput" onChange={(e) => e.target.value ? handleInputChange(e, 'confirm') : setHasValueConfirm(false)} />
                            </div>
                            <button className={!hasValueConfirm ? 'submitBtn prev' : 'submitBtn'} style={{marginTop: '350px'}} type='submit' onClick={confirmCodeChecking}>{!hasValueConfirm ? 'Previous' : 'Next'}</button>
                        </div>
                    </div>
                    {/* new password block */}
                    <div className="resetPasswordContainer" style={{display: activeBlock !== 'newpassword' && 'none'}}>
                        <div className="formBlockTop">
                            <img className='logoImg' src={PF + 'logo/logo.png'} alt="" />
                            <div className="crossBlock" onClick={() => {setActiveForm(false); setActiveBlock('name')}} title='Close'>
                                <img src={PF + 'icon/utility/x.svg'} alt="" />
                            </div>
                        </div>
                        <div className="formContainer">
                            <h1 className="formTitle" style={{textAlign: 'left'}}>Enter new password</h1>
                            <p className="formBottomDesc">The password must contain at least 8 characters. To create a strong password, use numbers, letters, and punctuation.</p>
                            <div className={activeInputNewPassword ? 'addListInputBlock Input active' : 'addListInputBlock Input'} style={{borderColor: activeErrorNewPassword && '#F6444F', marginTop: '20px'}} onClick={() => setActiveInputNewPassword(true)} onBlur={handleNewPasswordOnBlur}>
                                <label className={activeErrorNewPassword && activeInputNewPassword ? 'addListLabel active error' : activeLabelBlueNewPassword ? 'addListLabel activeBlue' : activeLabelGrayNewPassword ? 'addListLabel active' : 'addListLabel'} htmlFor="newpass">New password</label>
                                <input id='newpass' type={hindNewPassword ? "password" : "text"} className="addListInput" onChange={(e) => e.target.value ? handleInputChange(e, 'newpassword') : setHasValueNewPassword(false)} />
                                <div className="hindPasswordBlock" onClick={() => setHindNewPassword(!hindNewPassword)} title='Reveal password'>
                                    <img src={hindNewPassword ? PF + 'icon/utility/eye.svg' : PF + 'icon/utility/eye-off.svg'} alt="" />
                                </div>
                                <span className="errorMessage">{activeErrorNewPassword ? 'The password must be at least 8 characters long. Specify a longer password.' : ''}</span>
                            </div>
                            <div className={activeInputConfirmNewPassword ? 'addListInputBlock Input active' : 'addListInputBlock Input'} style={{borderColor: activeErrorConfirmNewPassword && '#F6444F', marginTop: '20px'}} onClick={() => setActiveInputConfirmNewPassword(true)} onBlur={handleConfirmNewPasswordOnBlur}>
                                <label className={activeErrorConfirmNewPassword && activeInputConfirmNewPassword ? 'addListLabel active error' : activeLabelBlueConfirmNewPassword ? 'addListLabel activeBlue' : activeLabelGrayConfirmNewPassword ? 'addListLabel active' : 'addListLabel'} htmlFor="confirmnewpass">Confirm new password</label>
                                <input id='confirmnewpass' type={hindConfirmNewPassword ? "password" : "text"} className="addListInput" onChange={(e) => e.target.value ? handleInputChange(e, 'confirmnewpassword') : setHasValueConfirmNewPassword(false)} />
                                <div className="hindPasswordBlock" onClick={() => setHindConfirmNewPassword(!hindConfirmNewPassword)} title='Reveal password'>
                                    <img src={hindConfirmNewPassword ? PF + 'icon/utility/eye.svg' : PF + 'icon/utility/eye-off.svg'} alt="" />
                                </div>
                                <span className="errorMessage">{activeErrorConfirmNewPassword === 'minlength' ? 'The password must be at least 8 characters long. Specify a longer password.' : activeErrorConfirmNewPassword === 'dontmatch' ? "Passwords don't match" : ''}</span>
                            </div>
                            <button className={!hasValueNewPassword || !hasValueConfirmNewPassword || activeErrorNewPassword || activeErrorConfirmNewPassword ? 'submitBtn disabled' : 'submitBtn'} disabled={!hasValueNewPassword || !hasValueConfirmNewPassword || activeErrorNewPassword || activeErrorConfirmNewPassword ? true : false} style={{marginTop: '280px'}} type='submit' onClick={changeUserPassword}>Change password</button>
                        </div>
                    </div>
                    {/* error alert */}
                    <div className={activeErrorEmail !== false || activeErrorPassword || activeErrorConfirm ? "formModal active"  : "formModal"}>
                        <span>
                            {activeErrorEmail === 'wrongemail' ? 'Sorry, we could not find your account.' : activeErrorEmail === 'emptyfield' ? 'Enter your email.' : activeErrorPassword ? 'Wrong password.' : activeErrorConfirm && 'Wrong confirmation code'}
                        </span>
                    </div>
                </div>
            <div className="overlay" onClick={() => {setActiveForm(false); setActiveBlock('name'); setActiveErrorEmail(false); setActiveErrorPassword(false)}}></div>
        </div>
    );
}

export default LoginForm;