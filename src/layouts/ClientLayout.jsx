import React from 'react';
import Navbar from '../components/NavBar';
import '../App.css';
import { Outlet } from 'react-router-dom';
const ClientLayout = () => {
    return (
        <>
            <div className="App">
                <Navbar />
                <main>
                    <Outlet />
                </main>
            </div>
        </>
    );
};

export default ClientLayout;
