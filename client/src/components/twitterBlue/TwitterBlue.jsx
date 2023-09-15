// import css, react hook and navigation link

import './twitterBlue.css'

import { useState } from 'react'
import { Link } from 'react-router-dom'

const TwitterBlue = ({ active, setActive }) => {

    // declaring variable that helps to get images from folder directly without importing

    const PF = process.env.REACT_APP_PUBLIC_FOLDER

    // declaring states of switch menu blocks

    const [activeAnnually, setActiveAnnually] = useState(true)
    const [activeMonthly, setActiveMonthly] = useState(false)
    const [activeMore, setActiveMore] = useState(false)

    return (  
        <div className={active ? 'twitterBlue active' : 'twitterBlue'}>
            <div className={activeMore ? "twitterBlueContainer active" : "twitterBlueContainer"}>
                <div className="twitterBlueTop">
                    <img className='logoImg' src={PF + 'icon/common/checkmark.png'} alt="" />
                    <div className="crossBlock" onClick={() => {setActive(false); setActiveMore(false)}} title='Close'>
                        <img src={PF + 'icon/utility/x.svg'} alt="" />
                    </div>
                </div>
                <div className="twitterBlueMid">
                    <div className="twitterBlueTitleBlock">
                        <p className='twitterBlueTitle'>Blue subscribers with a verified phone number will get a blue checkmark once approved.</p> 
                        <img src={PF + 'icon/common/checkmark.png'} className='twitterBlueCheckmark' alt="" />
                    </div>
                    {/* switch menu */}
                    <div className="twitterBlueSwitchBlock">
                        <div className={activeAnnually ? "twitterBlueSwitchItem" : 'twitterBlueSwitchItem disabled'} onClick={() => {setActiveMonthly(false); setActiveAnnually(true) }}>
                            <span className='specialSpan'>Annually</span>
                        </div>
                        <div className={activeMonthly ? "twitterBlueSwitchItem" : 'twitterBlueSwitchItem disabled'} onClick={() => {setActiveMonthly(true); setActiveAnnually(false) }}>
                            <span>Monthly</span>
                        </div>
                    </div>
                    <div className="twitterBlueDesc">
                        <div className="twitterBlueDescTop">
                            <h2>Blue</h2>
                        </div>
                        <ul className="twitterBlueDescList">
                            <li className="twitterBlueDescItem">Prioritized rankings in conversations and search</li>
                            <li className="twitterBlueDescItem">See approximately twice as many Tweets between ads in your For You and Following timelines.</li>
                            <li className="twitterBlueDescItem">Add bold and italic text in your Tweets</li>
                            <li className="twitterBlueDescItem">Post longer videos and 1080p video uploads</li>
                            <li className="twitterBlueDescItem">All the existing Blue features, including Edit Tweet, Bookmark Folders and early access to new features</li>
                        </ul>
                        <div className={activeMore ? "learnMoreBlock active" : 'learnMoreBlock'} onClick={() => setActiveMore(!activeMore)}>
                            Learn more
                            <img src={activeMore ? PF + 'icon/utility/chevronUp.svg' : PF + 'icon/utility/chevronDownGray.svg'} alt="" />
                        </div>
                        {/* addition information */}
                        <div className={activeMore ? "moreBlock active" : 'moreBlock'}>
                            <div className="moreBlockItem">
                                <img src={PF + 'icon/common/feather.svg'} alt="" className="moreBlockIcon" />
                                <div className="moreBlockContent">
                                    <h3 className="moreBlockTitle">Longer Tweets</h3>
                                    <span className="moreBlockDesc">Create Tweets, replies and Quotes up to 10,000 characters long.</span>
                                </div>
                            </div>
                            <div className="moreBlockItem">
                                <img src={PF + 'icon/common/edit.svg'} alt="" className="moreBlockIcon" />
                                <div className="moreBlockContent">
                                    <h3 className="moreBlockTitle">Edit Tweet</h3>
                                    <span className="moreBlockDesc">Edit a Tweet up to 5 times within 30 minutes.</span>
                                </div>
                            </div>
                            <div className="moreBlockItem">
                                <img src={PF + 'icon/common/userSmall.svg'} alt="" className="moreBlockIcon" />
                                <div className="moreBlockContent">
                                    <h3 className="moreBlockTitle">NFT Profile Pictures</h3>
                                    <span className="moreBlockDesc">Show your personal flair and set your profile picture to an NFT you own.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="twitterBlueBottom" style={{borderBottomRightRadius: activeMore ? '0px' : '12px'}}>
                    <div className="twitterBlueBottomContainer">
                        <button className="twitterBlueBottomBtn"><span className='fullPrice' style={{display: activeMonthly ? 'none' : 'inline'}}>$96.00</span> {activeAnnually ? '$84.00 / year' : '$8.00 / month'}</button>
                        <p className="twitterBlueBottomDesc">
                            By subscribing, you agree to our <Link>Purchaser Terms of Service.</Link>  Subscriptions auto-renew until canceled, as described in the Terms. Cancel anytime. A verified phone number is required to subscribe. If you've subscribed on another platform, manage your subscription through that platform.
                        </p>
                    </div>
                </div>
            </div>
            <div className="overlay" onClick={() => {setActive(false); setActiveMore(false)}}></div>
        </div>
    );
}

export default TwitterBlue;