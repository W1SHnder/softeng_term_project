import React, { useState } from 'react';

import Users from './Users';
import Movies from './Movies';
import Analytics from './Analytics';
import './styles/Admin.css';

const Navbar = () => {
    const [activeTab, setActiveTab] = useState('Users');

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Users':
                return <Users />;
            case 'Movies':
                return <Movies />;
            case 'Analytics':
                return <Analytics />;
            default:
                return null;
        }
    };

    return (
        <div>
            <nav>
                <ul>
                    <li className={activeTab === 'Users' ? 'active' : ''} onClick={() => handleTabClick('Users')}>Users</li>
                    <li className={activeTab === 'Movies' ? 'active' : ''} onClick={() => handleTabClick('Movies')}>Movies</li>
                    <li className={activeTab === 'Analytics' ? 'active' : ''} onClick={() => handleTabClick('Analytics')}>Analytics</li>
                </ul>
            </nav>
            {renderTabContent()}
        </div>
    );
};

function App() {
    return (
        <div className="App">
            <Navbar />
        </div>
    );
}

export default App;
