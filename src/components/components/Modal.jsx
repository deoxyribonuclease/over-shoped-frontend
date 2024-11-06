import {useState} from "react";
import "../styles/Modal.css"

import ModalHeader from './ModalHeader.jsx';
import ModalContent from './ModalContent.jsx';

const Modal = ({onClose}) =>  {

//це одна з умов закриття форми якщо натиснути не на модальне вікно
const handleContainerClick = (e) => {
    if(e.target.className === 'modal-container'){
        onClose();
        }
    }

//це логіка переходу між формами
 const[currentForm, setCurrentForm] = useState('login');

const formTitles = {
    login: 'Вхід в особистий кабінет',
    signUp: 'Реєстрація',
    resetPassword: 'Відновлення паролю'
    };

return (
   <div className = "modal-container" onClick = {handleContainerClick}>
        <div className="modal" onClick = {(e)=> e.stopPropagation()}>
            <div className = "button_closeForm">
                 <p className="close" onClick = {() => onClose()}> &times; </p>
            </div>
            <ModalHeader title = {formTitles[currentForm]}/>
            <ModalContent currentForm = {currentForm} onSwitchForm={setCurrentForm} />

        </div>
   </div>
  );
};

export default Modal;