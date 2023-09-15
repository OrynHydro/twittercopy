// importing css file for this page, specific components and react hook

import './settings.css'

import { SettingsMain, Sidebar, UnregisteredBlock } from '../../../components/index';

import { useState } from 'react';

const Settings = () => {
    const [activePage, setActivePage] = useState('personalization');
    return (  

        // settings page, wrapped by flexible div 

        <div style={{display: 'flex'}}>
            <Sidebar />
            <SettingsMain activePage={activePage} setActivePage={setActivePage} />
            <UnregisteredBlock activePage={activePage} />
        </div>
    );
}

export default Settings;