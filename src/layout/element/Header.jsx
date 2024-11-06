
import React from 'react';
import '../styles/header.css';
import {Navigator} from "../index.js";

function Header({setModalOpen}) {
    return (
         <header className="header">
            <Navigator openModal = {()=>setModalOpen(true)}/>
         </header>
    );
}

export default Header;
