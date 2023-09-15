// import css, react hooks, objects from helpers and navigation tools

import './settingsRightbar.css'

import { useState, useEffect } from 'react';
import { sidebarPersonalization, sidebarData, sidebarDataAcc, sidebarDataAccItems, sidebarDataApps, sidebarDataInterests, sidebarAddition } from '../../helpers/settingsSidebar';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const SettingsRightbar = ({ setText }) => {    

    // declaring variable that helps to get images from folder directly without importing

    const PF = process.env.REACT_APP_PUBLIC_FOLDER
    // declaring location var
    const location = useLocation()

    // declaring states of button, form and checkbox inputs

    const [activeBtn, toggleActiveBtn] = useState(true);

    const [activeForm, toggleActiveForm] = useState(false);

    const [activeInput1, toggleActiveInput1] = useState(true);
    const [activeInput2, toggleActiveInput2] = useState(true);
    const [activeInput3, toggleActiveInput3] = useState(true);

    // funcs that change input states

    const buttonChanging = () => {
        if(activeBtn) {
            toggleActiveForm(true)
        } else if(!activeBtn) {
            toggleActiveBtn(true)
            toggleActiveInput1(true)
            toggleActiveInput2(true)
            toggleActiveInput3(true)
        }
    }

    const onclickDisable = () => {
        toggleActiveForm(false)
        toggleActiveBtn(false)
        toggleActiveInput1(false)
        toggleActiveInput2(false)
        toggleActiveInput3(false)
    }

    const inputChanging1 = () => {
        if(activeInput1) {
            toggleActiveInput1(false)
        } else {
            toggleActiveInput1(true)
            toggleActiveBtn(true)
        } 
    }

    const inputChanging2 = () => {
        if(activeInput2) {
            toggleActiveInput2(false)
        } else {
            toggleActiveInput2(true)
            toggleActiveBtn(true)
        } 
    }

    const inputChanging3 = () => {
        if(activeInput3) {
            toggleActiveInput3(false)
        } else {
            toggleActiveInput3(true)
            toggleActiveBtn(true)
        } 
    }

    useEffect(() => {
        if(activeBtn && activeInput1 && activeInput2 && activeInput3) setText('Allow All')
        if(!activeBtn || !activeInput1 || !activeInput2 || !activeInput3) setText('Allow some')
        if(!activeBtn && !activeInput1 && !activeInput2 && !activeInput3) setText('Off')
    })

    const Personalization = () => {
        document.title = 'Personalization and data / Twitter'
        return (
            <div className='settingsRightbar'>
                <div className="settingsRightbarTop">
                    <h1 className="settingsRightbarTitle">Personalization and data</h1>
                </div>
                <span className='settingsRightbarText'>
                    These settings apply to this browser or device while you’re logged out. They don’t have any effect when you’re logged in.
                </span>
                <hr className='settingsRightbarHr' />
                <div className="settingsRightbarItem">
                    <div className="settingsRightbarItemTop">
                        <span className='settingsRightbarItemTitle'>Personalization and data</span>
                        <button className={activeBtn ? 'settingsRightbarItemBtn active' : 'settingsRightbarItemBtn'} onClick={buttonChanging}>
                            <span></span>
                        </button>
                    </div>
                    <span className="settingsRightbarItemText">This will enable or disable all of the settings on this page.</span>
                </div>
                {/* shortened code of three inputs block */}
                {sidebarPersonalization.map((item) => (
                    <div key={item.id}>
                        <hr className='settingsRightbarHr' />
                        <div className="settingsRightbarItem">
                            <h1 className="settingsRightbarTitle">{item.title}</h1>
                            {item.items.map((i) => {
                                const inputNum = (number, func) => {
                                    if(func === "activeInput") { 
                                        switch (number) {
                                        case 1:
                                            return activeInput1
                                        case 2:
                                            return activeInput2
                                        case 3:
                                            return activeInput3
                                        }
                                    } else if(func === "inputChanging") { 
                                        switch (number) {
                                        case 1:
                                            return inputChanging1
                                        case 2:
                                            return inputChanging2
                                        case 3:
                                            return inputChanging3
                                        }
                                    }
                                }
                                return (
                                    <div key={i.id}>
                                        <div className="settingsRightbarItemTop">
                                            <span className='settingsRightbarItemTitle'>Personalized ads</span>
                                            <div className="checkboxBlock">
                                                <input type="checkbox" checked={inputNum(i.id, "activeInput") ? true : false} onChange={inputNum(i.id, "inputChanging")} />
                                            </div>
                                        </div>
                                        <span className="settingsRightbarItemText">{i.text}</span>
                                        <span className="addition">Learn more</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
                <div className={activeForm ? 'form active' : 'form' }>
                    <div className="formBlock">
                        <h1 className='formTitle'>Disable personalization and data?</h1>
                        <span className="formText">This may make the Tweets and ads you see less relevant</span>
                        <button className='disableBtn' onClick={onclickDisable}>Disable</button>
                        <button className='cancelBtn' onClick={() => toggleActiveForm(false)}>Cancel</button>
                    </div>
                    <div className="overlay" onClick={() => toggleActiveForm(false)}></div>
                </div>
            </div>
        );
    } 

    const Data = () => {
        document.title = 'Your Twitter data / Twitter'
        return (
            <div className="settingsRightbar">
                <div className="settingsRightbarTop">
                    <h1 className="settingsRightbarTitle">Your Twitter data</h1>
                </div>
                {/* shortened code of items that differs only by title */}
                {sidebarData.map((item) => {
                    return (
                        <Link key={item.id} to={item.onclick}>
                            <div className='settingsItem specialItem'>
                                <h3 className="settingsItemTitle">{item.title}</h3>
                                <img className='settingsItemImg' src={PF + 'icon/utility/chevronRight.svg'} alt="" />
                            </div>
                        </Link>
                    )
                })}
            </div>
        )
    } 
    const DataAcc = () => {
        document.title = 'Account information / Twitter'
        return (
            <div className='settingsRightbar'>
                <div className="settingsRightbarTop">
                    <h1 className="settingsRightbarTitle">Account information</h1>
                </div>
                {/* shortened code of items that differs only by title */}
                {sidebarDataAcc.map((item) => {
                    return (
                        <Link key={item.id} to={`/settings/your_twitter_data/${item.onclick !== '' ? item.onclick : false}`}>
                            <div className='settingsItem specialItem'>
                                <h3 className="settingsItemTitle">{item.title}</h3>
                                <img className='settingsItemImg' src={PF + 'icon/utility/chevronRight.svg'} alt="" />
                            </div>
                        </Link>
                    )
                })}
                <div className="settingsItem-unhovered">
                    <p className="settingsRightbarItemText">
                        This information applies to your browser or device while you’re logged out. It may be different when you’re logged in.
                    </p>
                    <span className="settingsRightbarItemText">
                        Control how Twitter customizes your experience in 
                    </span>
                    <span className="addition">your personalization and data settings</span>
                </div>
            </div>
        )
    } 
    const DataApps = () => {
        document.title = 'Logged-in devices and apps / Twitter'
        return (
            <div className='settingsRightbar'>
                <div className="settingsRightbarTop">
                    <h1 className="settingsRightbarTitle">Logged-in devices and apps</h1>
                </div>
                {/* shortened code of items that differs by title, text etc. */}
                {sidebarDataApps.map((item) => {
                    return (
                        <div key={item.id}>
                            <hr className={item.hasHr === false ? "" : "settingsHr"}  />
                            <div className='settingsItem-unhovered'>
                                <h3>{item?.title}</h3>
                                <h4>{item?.counter} {item?.title}</h4>
                                <span className="settingsRightbarItemText">{item.text}</span>
                                <span className="addition">{item.addition}</span>
                                <span className="settingsRightbarItemText">{item.settings}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    } 
    const DataInterests = () => {
        document.title = 'Interests and ads data / Twitter'
        return (
            <div className='settingsRightbar'>
                <div className="settingsRightbarTop">
                    <h1 className="settingsRightbarTitle">Interests and ads data</h1>
                </div>
                {/* shortened code of items that differs by title, value etc. */}
                {sidebarDataInterests.map((item) => {
                    return (
                        <Link key={item.id} to={`/settings/your_twitter_data/${item.onclick}`}>
                            <div className='settingsItem specialItem'>
                                <h3 className="settingsItemTitle">{item.title}</h3>
                                <img className='settingsItemImg' src={PF + 'icon/utility/chevronRight.svg'} alt="" />
                                <h4>{item.counter}</h4>
                            </div>
                        </Link>
                    )
                })}
            </div>
        )
    } 
    const DataDownload = () => {
        document.title = 'Request your data / Twitter'
        return (
            <div className='settingsRightbar'>
                <div className="settingsRightbarTop">
                    <h1 className="settingsRightbarTitle">Request your data</h1>
                </div>
                <div className='settingsItem-unhovered'>
                    <p className="settingsRightbarRequest">Download a file with all the information associated with your account to this device?</p>
                </div>
                <hr className="settingsHr" />
                <div className='settingsItem-unhovered'>
                    <button className="settingsDownloadItem">Download</button>
                </div>
            </div>
        )
    } 
    // components with different data
    const DataAccGen = () => (
        <SettingsDataAcc props={sidebarDataAccItems[0]} />
    )
    const DataAccAge = () => (
        <SettingsDataAcc props={sidebarDataAccItems[1]} />
    )
    const SettingsDataAcc = ({props}) => {
        props.title === 'Gender' 
        ? document.title = 'Gender / Twitter'
        : props.title === 'Age'
        ? document.title = 'Age / Twitter'
        : document.title = 'Twitter'
        return (  
                <div className='settingsRightbar'>
                    <div className="settingsRightbarTop">
                        <h1 className="settingsRightbarTitle">{props.title}</h1>
                    </div>
                    <div className='settingsItem-unhovered'>
                        <p className='settingsRightbarPostTitle'>{props.postTitle}</p>
                    </div>
                    <hr className="settingsHr" />
                    <div className='settingsItem-unhovered'>
                        <h1 className="settingsCenteredTitle">Nothing to see here — yet</h1>
                        <p className="settingsCenteredText">It may take a while to gather this information. Try again later.</p>
                    </div>
                    <div className="settingsRightbarItem">
                        <div className="settingsRightbarItemTop">
                            <span className='settingsRightbarItemTitle'>Do not use this gender for personalization.</span>
                            <div className="checkboxBlock">
                                <input type="checkbox" />
                            </div>
                        </div>
                    </div>
                </div>
        );
    }
    const DataInterestsTwitter = () => {
        document.title = 'Interests / Twitter'
        return (
            <div className='settingsRightbar'>
                <div className="settingsRightbarTop">
                    <h1 className="settingsRightbarTitle">Interests</h1>
                </div>
                <div className='settingsItem-unhovered'>
                    <p className='settingsRightbarPostTitle'>These are some of the interests matched to you based on your profile, activity, and the Topics you follow. These are used to personalize your experience across Twitter, including the ads you see. You can adjust your interests if something doesn’t look right. Any changes you make may take a little while to go into effect.</p>
                </div>
                <div className='settingsItem-unhovered'>
                    <h1 className="settingsCenteredTitle">Nothing to see here — yet</h1>
                    <p className="settingsCenteredText">It may take a while to gather this information. Try again later.</p>
                </div>
                <hr className="settingsHr" />
            </div>
        )
    } 
    const DataInterestsPartners = () => {
        document.title = 'Inferred interests from partners / Twitter'
        return (
            <div className='settingsRightbar'>
                <div className="settingsRightbarTop">
                    <h1 className="settingsRightbarTitle">Inferred interests from partners</h1>
                </div>
                <p className="settingsCenteredTitle">There is nothing now. Come back later</p>
            </div>
        )
    } 
    const DataInterestsAudiences = () => {
        document.title = 'Your advertiser list / Twitter'
        return (
            <div className='settingsRightbar'>
                <div className="settingsRightbarTop">
                    <h1 className="settingsRightbarTitle">Your advertiser list</h1>
                </div>
                <div className='settingsItem-unhovered'>
                    <span className="settingsRightbarRequest">Tailored audiences are often built from email lists or browsing behaviors. They help advertisers reach prospective customers or people who have already expressed interest in their business. </span>
                    <span className="addition">Learn more</span>
                </div>
                <hr className="settingsHr" />
                <div className='settingsItem-unhovered'>
                    <span className="settingsRightbarRequest">You are currently a part of </span>
                    <strong>0 audiences</strong>
                    <span className="settingsRightbarRequest"> from </span>
                    <strong>0 aadvertisers</strong>
                </div>
                <hr className="settingsHr" />
                <div className='settingsItem-unhovered'>
                    <span className="settingsRightbarRequest">You can opt out of interest-based advertising in your personalization and data settings. This will change the ads you see on Twitter, however it won’t remove you from advertisers’ audiences.</span>
                </div>
            </div>
        )
    } 
    const Addition = () => {
        document.title = 'Additional resources / Twitter'
        return (
            <div className='settingsRightbar specialRightbar'>
                <div className="settingsRightbarTop">
                    <h1 className="settingsRightbarTitle">Additional resources</h1>
                </div>
                <div className='settingsItem-unhovered'>
                    <p className='settingsRightbarPostTitle'>Check out other places for helpful information to learn more about Twitter products and services. </p>
                </div>
                {/* shortened code of items that differs by title */}
                {sidebarAddition.map((item) => {
                    return (
                        <div key={item.id}>
                            <hr className={item.hasHr === false ? "" : "settingsHr"}  />
                            <div className="settingsItem-unhovered">
                                <strong><h1 className="settingsRightbarTitle">{item.title}</h1></strong>
                            </div>
                            {item.items.map((i) => {
                                return (
                                    <div key={i.id} className="settingsItem specialItem">
                                        <h3 className="settingsItemTitle">{i.title}</h3>
                                        <img className='settingsItemImg' src={PF + 'icon/utility/arrowUpRight.svg'} alt="" />
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <>
            {/* navigation function */}
            {location.pathname === '/settings' ? <Navigate to='/settings/account/personalization' /> : null}
            <Routes>
                <Route path='/account/personalization' element={<Personalization />} />
                <Route path='/your_twitter_data' element={<Data />} />
                <Route path='/your_twitter_data/account' element={<DataAcc />} />
                <Route path='/your_twitter_data/devices' element={<DataApps />} />
                <Route path='/your_twitter_data/ads' element={<DataInterests />} />
                <Route path='/your_twitter_data/request_data' element={<DataDownload />} />
                <Route path='/your_twitter_data/gender' element={<DataAccGen />} />
                <Route path='/your_twitter_data/age' element={<DataAccAge />} />
                <Route path='/your_twitter_data/twitter_interests' element={<DataInterestsTwitter />} />
                <Route path='/your_twitter_data/partner_interests' element={<DataInterestsPartners />} />
                <Route path='/your_twitter_data/audiences' element={<DataInterestsAudiences />} />
                <Route path='/about' element={<Addition />} />
            </Routes>
        </>
    )
}

export default SettingsRightbar;    