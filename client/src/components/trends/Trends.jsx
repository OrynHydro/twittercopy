// import css and react hook

import './trends.css'

import { useState } from 'react';

const Trends = ({ preTitle, title, img, imgActive, tweets, registered }) => {

    // declaring state of item that can be hovered to change its appearance

    const [hover, setHover] = useState(false)

    return (  
        <>
            <div className={registered ? 'trends registered' : 'trends'}>
                <div className="trendsItem">
                    <div className="trendsItemTitle">
                        <span className="trendsPreTitle">{preTitle}</span>
                        <div title='More' className="trendsMoreBlock" onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)} >
                            <img src={hover ? imgActive : img} alt="" className="trendsMoreImg" />
                        </div>
                    </div>
                    <h2 className="trendsTitle">{title}</h2>
                    <span className="trendsTwittsCounter">{tweets}</span>
                </div>
            </div>
        </>
    );
}

export default Trends;