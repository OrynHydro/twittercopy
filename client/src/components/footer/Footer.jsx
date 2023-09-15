// importing css file, navigation link, react and custom hook

import './footer.css'

import { Link } from 'react-router-dom';
import { useState } from 'react';

import { useOutsideClick } from '../../utils/useOutsideClick';

const Footer = () => {
    
    // declaring state for modal window

    const [active, setActive] = useState(false)

    // closing modal window by clicking outside it

    const root = useOutsideClick(() => setActive(false));

    return (  
        <div className="rightbarBottom" >
            <div className="rightbarBottomContainer">
                <div className="rightbarBottomPolicy">
                    <Link><span className='rightbarBottomText'>Terms of Service</span></Link>
                    <Link><span className='rightbarBottomText'>Privacy Policy</span></Link>
                    <Link><span className='rightbarBottomText'>Cookie Policy</span></Link>
                    <Link><span className='rightbarBottomText'>Accessibility</span></Link>
                    <Link><span className='rightbarBottomText'>Ads info</span></Link>
                    <span className='rightbarBottomText more' onClick={(e) => {e.stopPropagation(); setActive(true)}}>
                        More
                        <span style={{left: '2px'}}></span>
                        <span style={{left: '6px'}}></span>
                        <span style={{left: '10px'}}></span>
                    </span>
                        <ul ref={root} style={{height: `${active ? '176px' : '0px'}`}}>
                            <li>About</li>
                            <li>Status</li>
                            <li>Twitter for Business</li>
                            <li>Developers</li>
                        </ul>
                </div>
                <p className='rightbarBottomText' style={{textDecoration: 'none', cursor: 'default'}}>© Twitter, Inc., {new Date().getFullYear()}.</p>
                <a href='https://github.com/OrynHydro' target='_blank'><p className='rightbarBottomText'>Twitter copy by orynhydro (Vladyslav Oreshnykov)</p></a>
            </div>
        </div>
    );
}

export default Footer;