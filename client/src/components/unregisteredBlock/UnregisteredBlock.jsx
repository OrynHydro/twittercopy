// import css, auth forms and location hook

import './unregisteredBlock.css'

import { RegisterForm, LoginForm } from './../index'
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const UnregisteredBlock = ({activePage}) => {

    // declaring states of auth forms

    const [activeRegisterForm, setActiveRegisterForm] = useState(false)
    const [activeLoginForm, setActiveLoginForm] = useState(false)
    const location = useLocation()

    return ( 
        // bottom block with buttons that open auth forms
        <>
            <div className={location.pathname === '/settings/about' ? 'unregisteredBlock special' : 'unregisteredBlock'}>
                <div className="unregisteredBlockContainer">
                    <div className="unregisteredBlockTextContainer">
                        <h1 className="unregisteredBlockTitle">Don’t miss what’s happening</h1>
                        <p className="unregisteredBlockText">People on Twitter are the first to know.</p>
                    </div>
                    <div className="unregisteredBlockButtonContainer">
                        <button className='unregisteredBlockLogin' onClick={() => setActiveLoginForm(true)}>Log in</button>
                        <button className='unregisteredBlockRegister' onClick={() => setActiveRegisterForm(true)}>Sign up</button>
                    </div>
                </div>
            </div>
            <RegisterForm activeForm={activeRegisterForm} setActiveForm={setActiveRegisterForm} />
            <LoginForm activeForm={activeLoginForm} setActiveForm={setActiveLoginForm} />
        </> 
    );
}

export default UnregisteredBlock;