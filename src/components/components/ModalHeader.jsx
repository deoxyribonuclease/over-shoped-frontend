import React from 'react';
import '../styles/ModalHeader.css'

const ModalHeader= ({title}) => (
    <div className="modal-header">
        <h1 className = "header-title">{title}</h1>
    </div>
);
export default ModalHeader;