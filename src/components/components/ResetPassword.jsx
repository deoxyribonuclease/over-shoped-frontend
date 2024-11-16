import {useState} from "react";
import '../styles/UnificatedForm.css'
import EmailIcon from '../../assets/email.png'
import PassIcon from '../../assets/password.png'
import ShowIcon from '../../assets/icon-show-password-24.png'
import HideIcon from '../../assets/icon-hide-password-30.png'
import GoogleIcon from '../../assets/google_logo.png'
import {  validateEmail, validatePasswordForSignUp, validateRepeatPassword } from "../../utils/ValidationService";

const ResetPassword = ({onSwitchForm}) => {
//змінні для валідування форми
const [stage,setStage] = useState(1);
const [email,setEmail] = useState('');
const [emailError,setEmailError] = useState('');
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

          let emailErr = '';
          let passwordErr = '';
          let repeatPasswordErr = '';

          if (stage === 1) {
              emailErr = validateEmail(email);
              if (emailErr) {
                  setEmailError(emailErr);
                  return false;
              }
              setEmailError('');
          }

          if (stage === 2) {
              // Validate password first
              passwordErr = validatePasswordForSignUp(password);
              if (passwordErr) {
                  setPasswordError(passwordErr);
                  return false;
              } else {
                  setPasswordError('');
              }

              repeatPasswordErr = validateRepeatPassword(password, repeatPassword);
              if (repeatPasswordErr) {
                  setRepeatPasswordError(repeatPasswordErr);
                  return false;
              } else {
                  setRepeatPasswordError('');
              }
          }

          setEmailError('');
          setPasswordError('');
          setRepeatPasswordError('');
          return true;
}

const handleEmailSubmit = () =>{
    if(validateFields()){
        setStage(2);
    }
    else{
    console.log('Form failed some field has incorrect formatting!');
    }
}

const handlePasswordSubmit = () => {
    if(validateFields()){
        console.log('Added new password')
    }
    else{
        console.log('Failed to procedure some field had incorrect formatting!')
    }
}
return(
    <div className = "form-container">
        {stage === 1 ? (
        <>
            <div className = "input-fields">
                <div className = "input" style={{ border: emailError ? '1px solid red' : '1px solid #ccc' }}>
                    <img src ={EmailIcon}/>
                    <input
                    type ="email"
                    placeholder = "E-mail"
                    value={email}
                    onChange = {handleEmailChange}/>
                </div>
                {emailError && <p className = "error-message">{emailError}</p>}
            </div>
            <button className="submit-button" onClick = {handleEmailSubmit}> Змінити пароль </button>
            <div >
                        <span className="link-button" onClick = {() => onSwitchForm('login')}>Згадали пароль</span>
            </div>
            </>
        ) : (
            <>
         <div className = "input-fields">
                        <div className="input" style={{ border: passwordError ? '1px solid red' : '1px solid #ccc' }}>
                                        <img src = {PassIcon}/>
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
                                        <img src = {PassIcon}/>
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
                <button className="submit-button" onClick ={handlePasswordSubmit}> Скинути пароль </button>
                </>
        )}

        <h2>Увійти за допомогою</h2>

            <button className="google-button">
                <img src ={GoogleIcon}/>
                 Google
            </button>
       </div>
     );
}
export default ResetPassword;