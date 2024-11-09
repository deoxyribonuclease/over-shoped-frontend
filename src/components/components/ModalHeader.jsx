import React, {useState} from 'react';
import '../styles/ModalHeader.css'
import TimedAlert from "./TimedAlert.jsx";


const ModalHeader= ({title}) => (

    <div className="modal-header">
        <h1 className = "header-title">{title}</h1>
    </div>
);
export default ModalHeader;