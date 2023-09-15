// importing css file, react and custom hoosk, user context, axios, emailjs and momentjs libraries

import './registerForm.css'

import { Link, useNavigate } from 'react-router-dom'

import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useOutsideClick } from '../../utils/useOutsideClick'

import emailjs from '@emailjs/browser'

import { UserContext } from '../../context/UserContext'

import { useToken } from '../../utils/useToken'
import { useLocalStorage } from '../../utils/useLocalStorage'
import moment from 'moment'

const RegisterForm = ({activeForm, setActiveForm}) => {
    
    // declaring variable that helps to get images from folder directly without importing

    const PF = process.env.REACT_APP_PUBLIC_FOLDER

    // function that closes form

    const handleCloseForm = () => {
        setActiveForm(false); 
        setActiveBlock('join'); 
        setActiveErrorName(false)
    }

    // user data states 

    const {user, setUser} = useContext(UserContext)
    const [userInStorage, setUserInStorage] = useLocalStorage('user')

    // active stage

    const [activeBlock, setActiveBlock] = useState('join')

    // declaring states of custom input fields

    const [activeInputName, setActiveInputName] = useState(false)
    const [hasValueName, setHasValueName] = useState(false)
    const [activeLabelBlueName, setActiveLabelBlueName] = useState(false)
    const [activeLabelGrayName, setActiveLabelGrayName] = useState(false)
    const [activeErrorName, setActiveErrorName] = useState(false)
    const [inputNameValue, setInputNameValue] = useState('')

    const [activeInputEmail, setActiveInputEmail] = useState(false)
    const [hasValueEmail, setHasValueEmail] = useState(false)
    const [activeLabelBlueEmail, setActiveLabelBlueEmail] = useState(false)
    const [activeLabelGrayEmail, setActiveLabelGrayEmail] = useState(false)
    const [activeErrorEmail, setActiveErrorEmail] = useState(false)
    const [inputEmailValue, setInputEmailValue] = useState('')
    
    const [activeInputVerify, setActiveInputVerify] = useState(false)
    const [hasValueVerify, setHasValueVerify] = useState(false)
    const [activeLabelBlueVerify, setActiveLabelBlueVerify] = useState(false)
    const [activeLabelGrayVerify, setActiveLabelGrayVerify] = useState(false)
    const [inputVerifyValue, setInputVerifyValue] = useState('')

    const [activeInputPassword, setActiveInputPassword] = useState(false)
    const [hasValuePassword, setHasValuePassword] = useState(false)
    const [activeLabelBluePassword, setActiveLabelBluePassword] = useState(false)
    const [activeLabelGrayPassword, setActiveLabelGrayPassword] = useState(false)
    const [inputPasswordValue, setInputPasswordValue] = useState('')
    const [activeErrorPassword, setActiveErrorPassword] = useState(false)
    
    const [activeInputId, setActiveInputId] = useState(false)
    const [hasValueId, setHasValueId] = useState(false)
    const [activeLabelBlueId, setActiveLabelBlueId] = useState(false)
    const [activeLabelGrayId, setActiveLabelGrayId] = useState(false)
    const [activeErrorId, setActiveErrorId] = useState(false)
    const [inputIdValue, setInputIdValue] = useState('')

    const [activeMonth, setActiveMonth] = useState(false)
    const monthSelect = useOutsideClick(() => setActiveMonth(false))
    const [month, setMonth] = useState('')

    const [activeDay, setActiveDay] = useState(false)
    const daySelect = useOutsideClick(() => setActiveDay(false))
    const [day, setDay] = useState('')

    const [activeYear, setActiveYear] = useState(false)
    const yearSelect = useOutsideClick(() => setActiveYear(false))
    const [year, setYear] = useState('')

    const date = moment(month).format('MMMM') + ' ' + day + ', ' + year

    // simplifies writing every year since 1904 etc.

    const getList = (type) => {
        if(type === 'year') {
            const year = 1904;
            return (
                Array.from( 
                    new Array(120), (v, i) =>
                    <option key={i} value={year+i}>{year+i}</option>
                )
            );
        } else if(type === 'day') {
            return (
                Array.from( 
                    new Array(31), (v, i) =>
                    <option key={i} value={i+1}>{i+1}</option>
                )
            );
        }
    }

    // changes states of custom inputs

    useEffect(() => {
        if(activeInputName) {
            setActiveLabelBlueName(true)
            setActiveLabelGrayName(false)
        } 
        if(hasValueName && !activeInputName) {
            setActiveLabelGrayName(true)
            setActiveLabelBlueName(false)
        } 
        if(!hasValueName && !activeInputName) {
            setActiveLabelGrayName(false)
            setActiveLabelBlueName(false)
        } 
    }, [activeInputName, hasValueName])

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
    }, [activeInputEmail, hasValueEmail])

    useEffect(() => {
        if(activeInputVerify) {
            setActiveLabelBlueVerify(true)
            setActiveLabelGrayVerify(false)
        } 
        if(hasValueVerify && !activeInputVerify) {
            setActiveLabelGrayVerify(true)
            setActiveLabelBlueVerify(false)
        } 
        if(!hasValueVerify && !activeInputVerify) {
            setActiveLabelGrayVerify(false)
            setActiveLabelBlueVerify(false)
        } 
    }, [activeInputVerify, hasValueVerify])

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
        if(activeInputId) {
            setActiveLabelBlueId(true)
            setActiveLabelGrayId(false)
        } 
        if(hasValueId && !activeInputId) {
            setActiveLabelGrayId(true)
            setActiveLabelBlueId(false)
        } 
        if(!hasValueId && !activeInputId) {
            setActiveLabelGrayId(false)
            setActiveLabelBlueId(false)
        } 
    }, [activeInputId, hasValueId])

    const handleInputChange = async (e, type) => {
        switch (type) {
            case 'name':
                setHasValueName(true)
                setInputNameValue(e.target.value)
                break;
            case 'email':
                try {
                    const dbHasEmail = await axios.get(`/users/findByEmail/${e.target.value}`)
                    if(dbHasEmail.data[0]?.email) {
                        setActiveLabelBlueEmail(false)
                        setActiveErrorEmail('dbHasEmail')
                    } else {
                        setActiveErrorEmail(false)
                    } 
                } catch(err) {
                    console.log(err)
                }
                
                setHasValueEmail(true)
                setInputEmailValue(e.target.value)
                break;
            case 'verify': 
                setHasValueVerify(true)
                setInputVerifyValue(e.target.value)
                break;
            case 'password': 
                setHasValuePassword(true)
                setInputPasswordValue(e.target.value)
                break;
            case 'id':
                setHasValueId(true)
                setInputIdValue(e.target.value)
                break;
        }
    }

    const nameOnBlur = () => {
        setActiveInputName(false)
        if(!hasValueName) {
            setActiveLabelBlueName(false)
            setActiveErrorName(true)
        } else if(hasValueName) {
            setActiveErrorName(false)
        }
    }

    const emailOnBlur = () => {
        setActiveInputEmail(false)
        if(!String(inputEmailValue).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            setActiveErrorEmail('wrongEmail')
        } 
    }

    const passwordOnBlur = () => {
        setActiveInputPassword(false)
        setActiveLabelBluePassword(false)
        if(inputPasswordValue.length < 8) {
            setActiveErrorPassword(true)
        } else {
            setActiveErrorPassword(false)
        }
    }
    

    const IdOnBlur = () => {
        setActiveInputId(false)
        setActiveLabelBlueId(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setActiveBlock('customize')
    }

    // disabling

    const [disabledBtn, setDisabledBtn] = useState(true) 

    useEffect(() => {
        if(hasValueName && !activeErrorName && hasValueEmail && !activeErrorEmail && month !== '' && day !== '' && year !== '')  {
            setDisabledBtn(false)
        } else {
            setDisabledBtn(true)
        }
    })
    
    const [activeCheckbox, setActiveCheckbox] = useState(true)

    // sending verification code

    const [verificationCode, setVerificationCode] = useState('')

    const templateParams = {
        user_name: inputNameValue,
        user_email: inputEmailValue,
        verify_code: ''
    }

    const sendEmail = async () => {
        genVerifyCode()
        setActiveBlock('loader')
        templateParams.verify_code && emailjs.send('service_c5q7g9f', 'template_rjb2qdf', templateParams, 'NBl5OvfBt04mNHzTi')
        .then(() => {
            setVerificationCode(templateParams.verify_code)
            setActiveBlock('verifyacc')
        })
    }

    const genVerifyCode = () => {
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const codeLength = 5;
        let code = ''
        for (let i = 0; i <= codeLength; i++) {
            let randomNumber = Math.floor(Math.random() * chars.length);
            code += chars.substring(randomNumber, randomNumber +1);
        }
        templateParams.verify_code = code
    }

    // checking verification code

    const [incorrectCode, setIncorrectCode] = useState(false)

    const [hindPassword, setHindPassword] = useState(true)

    const verifyChecking = () => {
        if(verificationCode === inputVerifyValue) {
            setActiveBlock('password')
            setIncorrectCode(false)
        } else {
            setIncorrectCode(true)
            setTimeout(() => setIncorrectCode(false), 5000)
        }
    }

    const navigate = useNavigate()

    const token = useToken()

    // register new user

    const registerUser = async () => {
        try {
            const dbHasUserId = await axios.get(`/users/findById/${inputIdValue}`)
            if(dbHasUserId.data?.userId) {
                setActiveLabelBlueId(false)
                setActiveErrorId(true)
            } else {
                setActiveErrorId(false)
            }
        } catch(err) {
            console.log(err)
        }
        if(hasValueId && !activeErrorId) {
            try {
                const userData = {
                    username: inputNameValue,
                    email: inputEmailValue,
                    password: inputPasswordValue,
                    birth: day + '.' + month + '.' + year,
                    token: token,
                    userId: `@${inputIdValue}`
                }
                await axios.post('/auth/register', userData)
                setUserInStorage(userData?.token)
                setTimeout(() => {navigate('/')}, 1000)
                setTimeout(() => {document.location.reload();}, 1001)
            } catch(err) {
                console.log(err)
            }
        }
    }

    return (  
        <div className={activeForm ? 'registerForm active' : 'registerForm'}>
            <div className="formBlock">
                {/* start register */}
                <div className="formMainBlock" style={{display: activeBlock === 'join' ? 'block' : 'none'}}>
                    <div className="formBlockTop">
                        <img className='logoImg' src={PF + 'logo/logo.png'} alt="" />
                        <div className="crossBlock" onClick={handleCloseForm} title='Close'>
                            <img src={PF + 'icon/utility/x.svg'} alt="" />
                        </div>
                    </div>
                    <div className="registerFormBlockContainer">
                        <h1 className="formTitle">Join Twitter today</h1>
                        <div className="rightbarTopItem">Sign up</div>
                        <div className="rightbarTopItem">Sign up</div>
                        <div className='orBlock'>or</div>
                        <div className="rightbarTopItem specialItem" onClick={() => setActiveBlock('createacc')}>Create account</div>
                        <div className="rightbarTopInfo">
                                By singing up, you agree to the <Link><span className='rightbarTopInfoLink'>Terms of Service</span></Link> and <Link><span className='rightbarTopInfoLink'>Privacy Policy</span></Link>, including <Link><span className='rightbarTopInfoLink'>Cookie Use.</span></Link>
                        </div>
                        <span className='formLogin'>Have an account already? <Link>Log In</Link></span>
                    </div>
                </div>
                <div className="formMainBlock" style={{display: activeBlock === 'createacc' ? 'block' : 'none'}}>
                    <div className="formBlockTop">
                        <h2 className="formBlockTopStep" style={{marginLeft: '64px'}}>Step 1 of 5</h2>
                        <div className="crossBlock" onClick={() => {setActiveForm(false); setActiveBlock('join')}} title='Close'>
                            <img src={PF + 'icon/utility/x.svg'} alt="" />
                        </div>
                    </div>
                    {/* name, email and birth */}
                    <div className="registerFormBlockContainerStep">
                        <h1 className="formTitle" style={{textAlign: 'left'}}>Create your account</h1>
                        <form onSubmit={handleSubmit}>
                            <div className={activeInputName ? 'addListInputBlock nameInput active' : 'addListInputBlock nameInput'} style={{borderColor: activeErrorName ? '#F6444F' : null, marginTop: '20px'}} onClick={() => setActiveInputName(true)} onBlur={nameOnBlur}>
                                <span className="addListInputCounter" style={{display: activeInputName ? 'inline' : 'none'}}>{hasValueName === false && inputNameValue.length === 1 ? 0 : inputNameValue.length} / 50</span>
                                <label className={activeErrorName && activeInputName ? 'addListLabel active error' : activeLabelBlueName ? 'addListLabel activeBlue' : activeLabelGrayName ? 'addListLabel active' : 'addListLabel'} htmlFor="nameInput">Name</label>
                                <input maxLength={50} id='nameInput' type="text" className="addListInput nameInput" onChange={(e) => e.target.value ? handleInputChange(e, 'name') : setHasValueName(false)} />
                                <span className="errorMessage">{activeErrorName ? 'What’s your name?' : ''}</span>
                            </div>
                            <div className={activeInputEmail ? 'addListInputBlock emailInput active' : 'addListInputBlock emailInput'} style={{borderColor: activeErrorEmail !== false ? '#F6444F' : null, marginTop: '40px'}} onClick={() => setActiveInputEmail(true)} onBlur={emailOnBlur}>
                                <label className={activeErrorEmail ? 'addListLabel active error' : activeLabelBlueEmail ? 'addListLabel activeBlue' : activeLabelGrayEmail ? 'addListLabel active' : 'addListLabel'} htmlFor="emailInput">Email</label>
                                <input id='emailInput' type="email" className="addListInput nameInput" onChange={(e) => e.target.value ? handleInputChange(e, 'email') : setHasValueEmail(false)} />
                                <span className="errorMessage">{activeErrorEmail === 'dbHasEmail' ? 'Email has already been taken' : activeErrorEmail === 'wrongEmail' ? 'Please enter a valid email.' : ''}</span>
                            </div>
                            <div className="formBottom">
                                <h3 className="formBottomTitle">Date of birth</h3>
                                <p className="formBottomDesc">This will not be shown publicly. Confirm your own age, even if this account is for a business, a pet, or something else.</p>
                                <div className="formBottomInputBlock">
                                    <div ref={monthSelect} className="formBottomSelectBlock" style={{borderColor: activeMonth ? '#1D9BF0' : '#CFD9DE'}}>
                                        <label style={{color: activeMonth ? '#1D9BF0' : '#536471'}} htmlFor="month" onClick={() => setActiveMonth(true)}>Month</label>
                                        <select id="month" onClick={() => setActiveMonth(true)} onChange={(e) => setMonth(e.target.value)}>
                                            <option value="none" />
                                            <option value="1">January</option>
                                            <option value="2">February</option>
                                            <option value="3">March</option>
                                            <option value="4">April</option>
                                            <option value="5">May</option>
                                            <option value="6">June</option>
                                            <option value="7">July</option>
                                            <option value="8">August</option>
                                            <option value="9">September</option>
                                            <option value="10">October</option>
                                            <option value="11">November</option>
                                            <option value="12">December</option>
                                        </select>
                                        <svg className='selectChevron' xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke={activeMonth ? '#1D9BF0' : "#494E51"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </div>
                                    <div ref={daySelect} className="formBottomSelectBlock" style={{borderColor: activeDay ? '#1D9BF0' : '#CFD9DE', width: '96px'}}>
                                        <label style={{color: activeDay ? '#1D9BF0' : '#536471'}} htmlFor="day" onClick={() => setActiveDay(true)}>Day</label>
                                        <select id="day" style={{width: '90px'}} onClick={() => setActiveDay(true)} onChange={(e) => setDay(e.target.value)}>
                                            <option value="none" />
                                            {getList('day')}
                                        </select>
                                        <svg className='selectChevron' xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke={activeDay ? '#1D9BF0' : "#494E51"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </div>
                                    <div ref={yearSelect} className="formBottomSelectBlock" style={{borderColor: activeYear ? '#1D9BF0' : '#CFD9DE', width: '118px'}}>
                                        <label style={{color: activeYear ? '#1D9BF0' : '#536471'}} htmlFor="year" onClick={() => setActiveYear(true)}>Year</label>
                                        <select id="year" style={{width: '118px'}} onClick={() => setActiveYear(true)} onChange={(e) => setYear(e.target.value)}>
                                            <option value="none" />
                                            {getList('year')}
                                        </select>
                                        <svg className='selectChevron' xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke={activeYear ? '#1D9BF0' : "#494E51"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </div>
                                </div>
                            </div>
                            <button className={disabledBtn ? 'submitBtn disabled' : 'submitBtn'} disabled={disabledBtn} type='submit'>Next</button>
                        </form>
                    </div>
                </div>
                <div className="formMainBlock" style={{display: activeBlock === 'customize' ? 'block' : 'none'}}>
                    <div className="formBlockTop">
                        <div className="formBlockTopLeft">
                            <div className="arrowBlock" onClick={() => setActiveBlock('createacc')}>
                                <img src={PF + 'icon/utility/arrowLeft.svg'} alt="" />
                            </div>
                            <h2 className="formBlockTopStep">Step 2 of 5</h2>
                        </div>
                    </div>
                    {/* checkbox block */}
                    <div className="registerFormBlockContainerStep">
                        <h1 className="formTitle" style={{textAlign: 'left'}}>Customize your experience</h1>
                        <h2 className="formPostTitle">Track where you see Twitter content across the web</h2>
                        <div className="formCustomizeInputBlock">
                            <label htmlFor="tracking">Twitter uses this data to personalize your experience. This web browsing history will never be stored with your name, email, or phone number.</label>
                            <div className={activeCheckbox ? "checkboxBlock active" : "checkboxBlock"} onClick={() => setActiveCheckbox(!activeCheckbox)}>
                                <input type="checkbox" onChange={() => setActiveCheckbox(!activeCheckbox)} checked={activeCheckbox}  />
                            </div>
                        </div>
                        <p className="formText">By signing up, you agree to our <Link>Terms</Link>, <Link>Privacy Policy</Link>, and <Link>Cookie Use</Link>. Twitter may use your contact information, including your email address and phone number for purposes outlined in our Privacy Policy. <Link>Learn more</Link> </p>
                        <button className='submitBtn' style={{marginTop: '196px'}} onClick={() => setActiveBlock('createaccconfirm')}>Next</button>
                    </div>
                </div>
                <div className="formMainBlock" style={{display: activeBlock === 'createaccconfirm' ? 'block' : 'none'}}>
                    <div className="formBlockTop">
                        <div className="formBlockTopLeft">
                            <div className="arrowBlock" onClick={() => setActiveBlock('customize')}>
                                <img src={PF + 'icon/utility/arrowLeft.svg'} alt="" />
                            </div>
                            <h2 className="formBlockTopStep">Step 3 of 5</h2>
                        </div>
                        <div className="crossBlock" onClick={() => {setActiveForm(false); setActiveBlock('join')}} title='Close'>
                            <img src={PF + 'icon/utility/x.svg'} alt="" />
                        </div>
                    </div>
                    {/* checking */}
                    <div className="registerFormBlockContainerStep">
                        <h1 className="formTitle" style={{textAlign: 'left'}}>Create your account</h1>
                        <div className='addListInputBlock' style={{marginTop: '25px'}} onClick={() => setActiveBlock('createacc')}>
                            <label className='addListLabel active' htmlFor="nameInput">Name</label>
                            <input id='nameInput' name='user_name' type="text" className="addListInput" value={inputNameValue} />
                        </div>
                        <div className='addListInputBlock' style={{marginTop: '25px'}} onClick={() => setActiveBlock('createacc')}>
                            <label className='addListLabel active' htmlFor="emailInput">Email</label>
                            <input id='emailInput' name='user_email' type="email" className="addListInput" value={inputEmailValue} />
                        </div>
                        <div className='addListInputBlock' style={{marginTop: '25px'}} onClick={() => setActiveBlock('createacc')}>
                            <label className='addListLabel active' htmlFor="dateInput">Date of birth</label>
                            <input id='dateInput' type="text" className="addListInput" value={date} />
                        </div>
                        <p className="formTextSmall" style={{marginTop: '60px'}}>
                            By signing up, you agree to the <Link>Terms of Service</Link> and <Link>Privacy Policy</Link>, including <Link> Cookie Use</Link>. Twitter may use your contact information, including your email address and phone number for purposes outlined in our Privacy Policy, like keeping your account secure and personalizing our services, including ads. <Link> Learn more</Link>. Others will be able to find you by email or phone number, when provided, unless you choose otherwise <Link> here</Link>.
                        </p>
                        <button className='submitBtn blue' onClick={sendEmail}>Sign up</button>
                    </div>
                </div>
                {/* loading spinner */}
                <div className="loader" style={{display: activeBlock === 'loader' ? 'block' : 'none'}} />
                <div className="formMainBlock" style={{display: activeBlock === 'verifyacc' ? 'block' : 'none'}}>
                    <div className="formBlockTop">
                        <div className="formBlockTopLeft">
                            <div className="arrowBlock" onClick={() => setActiveBlock('createaccconfirm')}>
                                <img src={PF + 'icon/utility/arrowLeft.svg'} alt="" />
                            </div>
                            <h2 className="formBlockTopStep">Step 4 of 5</h2>
                        </div>
                        <div className="crossBlock" onClick={() => {setActiveForm(false); setActiveBlock('join')}} title='Close'>
                            <img src={PF + 'icon/utility/x.svg'} alt="" />
                        </div>
                    </div>
                    <div className="registerFormBlockContainerStep">
                        {/* verification code */}
                        <h1 className="formTitle" style={{textAlign: 'left'}}>We sent you a code</h1>
                        <p className="formText" style={{marginTop: '0px'}}>Enter it below to verify {inputEmailValue}</p>
                        <div className={activeInputVerify ? 'addListInputBlock emailInput active' : 'addListInputBlock emailInput'} style={{marginTop: '20px'}} onClick={() => setActiveInputVerify(true)} onBlur={() => {setActiveInputVerify(false); setActiveLabelBlueVerify(false); setActiveLabelBlueVerify(false)}}>
                            <label className={activeLabelBlueVerify ? 'addListLabel activeBlue' : activeLabelGrayVerify ? 'addListLabel active' : 'addListLabel'} htmlFor="codeInput">Verification code</label>
                            <input id='codeInput' type="text" className="addListInput nameInput" onChange={(e) => e.target.value ? handleInputChange(e, 'verify') : setHasValueVerify(false)} />
                        </div>
                        <button className={hasValueVerify ? 'submitBtn' : 'submitBtn disabled'} style={{marginTop: '350px'}} disabled={hasValueVerify ? false : true} type='submit' onClick={verifyChecking}>Next</button>
                    </div>
                </div>
                {/* error alert */}
                <div className={incorrectCode ? "formModal active"  : "formModal"}>
                    <span>
                        The code you entered is incorrect. Please try again.
                    </span>
                </div>
                <div className="formMainBlock" style={{display: activeBlock === 'password' ? 'block' : 'none'}}>
                    <div className="formBlockTop">
                        <div className="formBlockTopLeft">
                            <h2 className="formBlockTopStep" style={{marginLeft: '64px'}}>Step 5 of 5</h2>
                        </div>
                        <div className="crossBlock" onClick={() => {setActiveForm(false); setActiveBlock('join')}} title='Close'>
                            <img src={PF + 'icon/utility/x.svg'} alt="" />
                        </div>
                    </div>
                    <div className="registerFormBlockContainerStep">
                        {/* password */}
                        <h1 className="formTitle" style={{textAlign: 'left'}}>You'll need a password</h1>
                        <p className="formText" style={{marginTop: '0px'}}>Make sure it’s 8 characters or more.</p>
                        <div className={activeInputPassword ? 'addListInputBlock active' : 'addListInputBlock'} style={{marginTop: '20px',borderColor: activeErrorPassword ? '#F6444F' : null}} onClick={() => setActiveInputPassword(true)} onBlur={passwordOnBlur}>
                            <label className={activeErrorPassword ? 'addListLabel active error' : activeLabelBluePassword ? 'addListLabel activeBlue' : activeLabelGrayPassword ? 'addListLabel active' : 'addListLabel'} htmlFor="passwordInput">Password</label>
                            <input id='passwordInput' type={hindPassword ? "password" : "text"} className="addListInput nameInput" onChange={(e) => e.target.value ? handleInputChange(e, 'password') : setHasValuePassword(false)} />
                            <span className="errorMessage">{activeErrorPassword ? 'Your password needs to be at least 8 characters. Please enter a longer one.' : ''}</span>
                            <div className="hindPasswordBlock" onClick={() => setHindPassword(!hindPassword)} title='Reveal password'>
                                <img src={hindPassword ? PF + 'icon/utility.eye.svg' : 'icon/utility.eye-off.svg'} alt="" />
                            </div>
                        </div>
                        <button className={hasValuePassword ? 'submitBtn' : 'submitBtn disabled'} style={{marginTop: '350px'}} disabled={hasValuePassword ? false : true} onClick={() => setActiveBlock('userid')}>Next</button>
                    </div>
                </div>
                <div className="formMainBlock" style={{display: activeBlock === 'userid' ? 'block' : 'none'}}>
                    <div className="formBlockTop">
                        <img className='logoImg' src={PF + 'logo/logo.png'} alt="" />
                    </div>
                    <div className="registerFormBlockContainerStep">
                        {/* userID */}
                        <h1 className="formTitle" style={{textAlign: 'left'}}>What will be your ID?</h1>
                        <p className="formText" style={{marginTop: '0px'}}>Your user ID is unique. You can change it whenever you want</p>
                        <div className={activeInputId ? 'addListInputBlock active' : 'addListInputBlock'} style={{borderColor: activeErrorId !== false ? '#F6444F' : null, marginTop: '40px'}} onClick={() => setActiveInputId(true)} onBlur={IdOnBlur}>
                            <span className='placeholderText'>@</span>
                            <label className={activeErrorId ? 'addListLabel active error' : activeLabelBlueId ? 'addListLabel activeBlue' : 'addListLabel active'} htmlFor="idInput">User ID</label>
                            <input id='idInput' type="text" className="addListInput inputWithPlaceholder" onChange={(e) => e.target.value ? handleInputChange(e, 'id') : setHasValueId(false)} />
                            <span className="errorMessage">{activeErrorId ? 'This user ID has already been taken' : ''}</span>
                        </div>
                        <button className={hasValueId && !activeErrorId ? 'submitBtn' : 'submitBtn disabled'} style={{marginTop: '350px'}} disabled={hasValueId && !activeErrorId ? false : true} type='submit' onClick={registerUser}>Next</button>
                    </div>
                </div>
            </div>
            <div className="overlay" onClick={handleCloseForm} />
        </div>
    );
}

export default RegisterForm;