import React, {useState, useEffect} from 'react';
import '../App.css';
import logo from './logo.png';

import {
    NavLink,
} from "react-router-dom";

const Navbar = () => {
    
    // For mobile version, when trying to hide the navbar
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        const handleClickOutside =(event) => {
            if (!event.target.closest('.navbar')) {
                setIsOpen(false);
        }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
        document.removeEventListener("click", handleClickOutside);
    };
    }, []);

    // mark the active section
    // const [isActive, setIsActive] = useState(false);
    
    // useEffect(() => {
    //     const handleScroll = () => {
    //         const sections = document.querySelectorAll('.section');
    //         const scrollPosition = window.scrollY;
    //         sections.forEach((section) => {
    //             const sectionTop = section.offsetTop;
    //             const sectionHeight = section.offsetHeight;
    //             if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
    //                 setIsActive(section.id);
    //     };
    //     document.addEventListener()
    // }

    // )
    return(
        <>
        
                <header className="navbar">
                <div className="nav-left">
                    {/* For mobile version */}
                    <div className="mobile-nav">
                        <NavLink to="/" className='name' >
                        
                            <img className="logo" src={logo} alt="logo" />
                        </NavLink>
                        
                        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Menu">
                            {isOpen ? (
                                <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
                                    <path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04-.04-.06-.05-.09-.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z"/>
                                </svg>
                            ) : (
                                <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
                                    <path d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 000-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0014.4 7z"/>
                                </svg>
                            )}
                        </div>
                    </div>
                </div>

                <nav className={`nav-links ${isOpen ? "open" : ""}`}>
                    {/* home */}
                    <NavLink to="/" 
                            className={({ isActive }) => `nav-link ${isActive ? "active1" : ""}`}
                            onClick={() => setIsOpen(false)}
                            >
                    
                    <svg stroke="currentColor" strokeWidth="0" viewBox="0 0 24 24" width="1.07em" height="1.07em" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                    <path d="M5 22h14a2 2 0 0 0 2-2v-9a1 1 0 0 0-.29-.71l-8-8a1 1 0 0 0-1.41 0l-8 8A1 1 0 0 0 3 11v9a2 2 0 0 0 2 2zm5-2v-5h4v5zm-5-8.59 7-7 7 7V20h-3v-5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v5H5z"></path>
                    </svg>
                    HOME
                    </NavLink>
             
                
                {/* about */}
                <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? "active1" : ""}`} onClick={() => setIsOpen(false)}>
            
                    <svg stroke="currentColor" strokeWidth="0" viewBox="0 0 24 24" width="1.1em" height="1.1em" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                        <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path><path d="M11 11h2v6h-2zm0-4h2v2h-2z"></path>
                    </svg>
                    ABOUT US
                    </NavLink>
               

                {/* services */}
                <NavLink to="/services" className={({ isActive }) => `nav-link ${isActive ? "active1" : ""}`} onClick={() => setIsOpen(false)}>
                
                    <svg stroke="currentColor" strokeWidth="0" viewBox="0 0 16 16" width="1em" height="1em" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                        <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v8A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1h-3zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5zm1.886 6.914L15 7.151V12.5a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5V7.15l6.614 1.764a1.5 1.5 0 0 0 .772 0zM1.5 4h13a.5.5 0 0 1 .5.5v1.616L8.129 7.948a.5.5 0 0 1-.258 0L1 6.116V4.5a.5.5 0 0 1 .5-.5z"></path>
                    </svg> 
                    SERVICES
                    </NavLink>
                
            

                {/* Projects */}
                <NavLink to="/projects" className={({ isActive }) => `nav-link ${isActive ? "active1" : ""}`} onClick={() => setIsOpen(false)}>
                
                    <svg stroke="currentColor" strokeWidth="0" viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                        <path d="m21.706 5.291-2.999-2.998A.996.996 0 0 0 18 2H6a.996.996 0 0 0-.707.293L2.294 5.291A.994.994 0 0 0 2 5.999V19c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5.999a.994.994 0 0 0-.294-.708zM6.414 4h11.172l.999.999H5.415L6.414 4zM4 19V6.999h16L20.002 19H4z"></path>
                        <path d="M15 12H9v-2H7v4h10v-4h-2z"></path>
                    </svg> 
                    PROJECTS
                </NavLink>
                
                {/* Contact */}
                <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? "active1" : ""}`} onClick={() => setIsOpen(false)}>
                
                    <svg stroke="currentColor" strokeWidth="0" viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                        <path d="M20 2H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h3v3.767L13.277 18H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm0 14h-7.277L9 18.233V16H4V4h16v12z"></path>
                        <path d="M8 9h8v2H8z"></path>
                    </svg> 
                    CONTACT US
                </NavLink>
                
                </nav>
            </header>

           
   
    </>
    );
};

export default Navbar;



