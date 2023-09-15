// importing css file for this page and specific components

import './explore.css'


import { Actual, Sidebar, Rightbar, UnregisteredBlock } from '../../../components/index';


const Explore = () => {

    // changes webpage title

    document.title = 'Explore / Twitter'

    return (  

        // "explore" page, wrapped by flexible div 

        <div>
            <div style={{display: 'flex'}}>
                <Sidebar />
                <Actual position />
                <Rightbar />
                <UnregisteredBlock />
            </div>
        </div>
    );
}

export default Explore;