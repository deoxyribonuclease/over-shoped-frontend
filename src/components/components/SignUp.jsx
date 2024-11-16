import {useState} from "react";
import '../styles/UnificatedForm.css';
import PersIcon from '../../assets/person.png'
import EmailIcon from '../../assets/email.png'
import PassIcon from '../../assets/password.png'
import ShowIcon from '../../assets/icon-show-password-24.png'
import HideIcon from '../../assets/icon-hide-password-30.png'
import GoogleIcon from '../../assets/google_logo.png'

import { validateName, validateEmail, validatePasswordForSignUp, validateRepeatPassword } from "../../utils/ValidationService";
import {registerUser} from "../../api/userApi.jsx";


const SignUp = ({onSwitchForm, triggerAlert}) => {

const [name,setName] = useState('');
const [nameError, setNameError] = useState('');
const [email, setEmail] = useState('');
const [emailError, setEmailError] = useState('');
const [password, setPassword] = useState('');
const [passwordError, setPasswordError] = useState('');
const [repeatPassword, setRepeatPassword] = useState('');
const [repeatPasswordError, setRepeatPasswordError] = useState('');



const [showPassword,setShowPassword] = useState(false);
const [showRepeatPassword,setShowRepeatPassword] = useState(false);

const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
}
const toggleRepeatPasswordVisibility = () => {
    setShowRepeatPassword(!showRepeatPassword);
}
const handleNameChange = (event) => {
   setName(event.target.value);
   setNameError('');
}
const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setEmailError('');
}
const handlePasswordChange = (event) =>{
    setPassword(event.target.value);
    setPasswordError('');
}
const handleRepeatPasswordChange = (event) => {
    setRepeatPassword(event.target.value);
    setRepeatPasswordError('');
}

 const validateFields = () => {

     const nameErr = validateName(name);
     if (nameErr) {
         setNameError(nameErr);
         setEmailError('');
         setPasswordError('');
         setRepeatPasswordError('');
         return false;
     }

     const emailErr = validateEmail(email);
     if (emailErr) {
         setNameError('');
         setEmailError(emailErr);
         setPasswordError('');
         setRepeatPasswordError('');
         return false;
     }

     const passwordErr = validatePasswordForSignUp(password);
     if (passwordErr) {
         setNameError('');
         setEmailError('');
         setPasswordError(passwordErr);
         setRepeatPasswordError('');
         return false;
     }

     const repeatPasswordErr = validateRepeatPassword(password, repeatPassword);
     if (repeatPasswordErr) {
         setNameError('');
         setEmailError('');
         setPasswordError('');
         setRepeatPasswordError(repeatPasswordErr);
         return false;
     }

     setNameError('');
     setEmailError('');
     setPasswordError('');
     setRepeatPasswordError('');
     return true;
 };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateFields()) {
            try {
                const data = await registerUser(email, password, name);
                if (data.message) {
                    triggerAlert('Користувач успішно зареєстрований!', 'success');
                    onSwitchForm('login');
                } else if (data.error) {
                    triggerAlert('Користувач з таким email вже існує!', 'error');
                }
            } catch (error) {
                triggerAlert('Щось пішло не так...', 'error');
                console.log(error);
            }
        } else {
            console.log('Form failed to validate');
        }
    };



return(
    <div className = "form-container">
        <div className = "input-fields">
            <div className = "input" style={{ border: nameError ? '1px solid red' : '1px solid #ccc' }}>
                <img src = {PersIcon} alt=""/>
                <input
                type = "text"
                placeholder = "Введіть ім'я"
                value={name}
                onChange={handleNameChange}
                />
            </div>
            {nameError && <p className = "error-message">{nameError}</p>}

            <div className="input" style={{ border: emailError ? '1px solid red' : '1px solid #ccc' }}>
                <img src = {EmailIcon}/>
                <input
                 type = "email"
                 placeholder = "E-mail"
                 value={email}
                 onChange={handleEmailChange}
                 />
            </div>
            {emailError && <p className = "error-message">{emailError}</p>}

            <div className="input" style={{ border: passwordError ? '1px solid red' : '1px solid #ccc' }}>
                <img src ={PassIcon}/>
                <input
                    type = {showPassword ? 'text' : 'password'}
                    placeholder = "Пароль"
                    value={password}
                    onChange={handlePasswordChange}
                    />
                <img className = "button-hide-show"
                    src = {showPassword ? ShowIcon : HideIcon}
                    alt={showPassword ? "Hide Password" : "Show Password"}
                    onClick={togglePasswordVisibility}
                />
            </div>
            {passwordError && <p className="error-message">{passwordError}</p>}

            <div className="input" style={{ border: repeatPasswordError ? '1px solid red' : '1px solid #ccc' }}>
                <img src ={PassIcon}/>
                <input
                type = {showRepeatPassword ? 'text' : 'password'}
                placeholder = "Повторіть пароль"
                value={repeatPassword}
                onChange={handleRepeatPasswordChange}
                />
                <img className = "button-hide-show"
                     src = {showRepeatPassword ? ShowIcon : HideIcon}
                     alt={showRepeatPassword ? "Hide Password" : "Show Password"}
                     onClick={toggleRepeatPasswordVisibility}
                />
            </div>
            {repeatPasswordError && <p className="error-message">{repeatPasswordError}</p>}

        </div>
    <button className="submit-button" onClick={handleSubmit}> Зареєструватися </button>
    <div >
        <span className="link-button" onClick = {() => onSwitchForm('login')}>Вхід в особистий кабінет</span>
    </div>
    <h2>Увійти за допомогою</h2>
     <button className="google-button">
                    <img src = {GoogleIcon}/>
                     Google
                </button>


    </div>

     );
}
export default SignUp;