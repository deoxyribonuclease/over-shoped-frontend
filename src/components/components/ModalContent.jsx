import React from 'react';

import LogIn from './LogIn';
import SignUp from './SignUp';
import ResetPassword from './ResetPassword';

const ModalContent = ({onClose, currentForm, onSwitchForm, triggerAlert}) => {
    switch (currentForm) {
        case 'login':
            return <LogIn  onClose={onClose} onSwitchForm={onSwitchForm} triggerAlert={triggerAlert}/>;
        case 'signUp':
            return <SignUp onSwitchForm={onSwitchForm} triggerAlert={triggerAlert} />;
        case 'resetPassword':
            return <ResetPassword onSwitchForm={onSwitchForm} />;
        default:
            return <LogIn onSwitchForm={onSwitchForm} />;
    }
};

export default ModalContent;
