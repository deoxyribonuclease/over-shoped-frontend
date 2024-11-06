import React from 'react';

import LogIn from './LogIn';
import SignUp from './SignUp';
import ResetPassword from './ResetPassword';

const ModalContent = ({currentForm,onSwitchForm}) => {
switch (currentForm) {
    case 'login':
        return <LogIn onSwitchForm={onSwitchForm} />;
    case 'signUp':
        return <SignUp onSwitchForm={onSwitchForm}/>;
    case 'resetPassword':
        return <ResetPassword onSwitchForm={onSwitchForm}/>
    default:
        return <LogIn onSwitchForm={onSwitchForm} />;
    }
}
export default ModalContent;