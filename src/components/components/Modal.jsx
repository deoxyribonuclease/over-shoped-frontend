import {useState} from "react";
import "../styles/Modal.css";

import ModalHeader from './ModalHeader.jsx';
import ModalContent from './ModalContent.jsx';
import TimedAlert from "./TimedAlert.jsx";

const Modal = ({onClose}) =>  {

    // це одна з умов закриття форми якщо натиснути не на модальне вікно
    const handleContainerClick = (e) => {
        if(e.target.className === 'modal-container'){
            onClose();
        }
    }

    const [alertOpen, setAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('success');

    // Відкрити сповіщення з повідомленням і типом
    const triggerAlert = (message, severity) => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setAlertOpen(true);
    };

    const handleCloseAlert = () => {
        setAlertOpen(false);
    };

    // це логіка переходу між формами
    const [currentForm, setCurrentForm] = useState('login');

    const formTitles = {
        login: 'Вхід в особистий кабінет',
        signUp: 'Реєстрація',
        resetPassword: 'Відновлення паролю'
    };

    return (
        <div className="modal-container" onClick={handleContainerClick}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="button_closeForm">
                    <p className="close" onClick={() => onClose()}>&times;</p>
                </div>
                <ModalHeader title={formTitles[currentForm]} />
                <ModalContent
                    onClose={onClose}
                    currentForm={currentForm}
                    onSwitchForm={setCurrentForm}
                    triggerAlert={triggerAlert}
                />
                <TimedAlert
                    alertOpen={alertOpen}
                    alertMessage={alertMessage}
                    alertSeverity={alertSeverity}
                    handleCloseAlert={handleCloseAlert}
                />
            </div>
        </div>
    );
};

export default Modal;
