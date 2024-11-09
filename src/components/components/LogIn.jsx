import {useState} from "react";
import '../styles/UnificatedForm.css'
import EmailIcon from '../../assets/email.png'
import PassIcon from '../../assets/password.png'
import ShowIcon from '../../assets/icon-show-password-24.png'
import HideIcon from '../../assets/icon-hide-password-30.png'
import GoogleIcon from '../../assets/google_logo.png'
import {  validateEmail, validatePasswordForLogIn } from "../../utils/ValidationService";
import {loginUser, registerUser} from "../../api/userApi.jsx";
import {useNavigate} from "react-router-dom";
import Cookies from 'js-cookie'; // Import js-cookie


const LogIn = ({onSwitchForm, triggerAlert}) => {

const [email,setEmail] = useState('');
const [emailError, setEmailError] = useState('');
const [password, setPassword] = useState('');
const [passwordError, setPasswordError] = useState('');

const [showPassword,setShowPassword] = useState(false);
    const navigate = useNavigate();
const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
}

const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setEmailError('');
}
const handlePasswordChange = (event) =>{
    setPassword(event.target.value);
    setPasswordError('');
}

const validateFields = () => {
        const emailErr = validateEmail(email);
         if (emailErr) {

             setEmailError(emailErr);
             setPasswordError('');

             return false;
         }
         const passwordErr = validatePasswordForLogIn(password);
          if (passwordErr) {

              setEmailError('');
              setPasswordError(passwordErr);

              return false;
          }

          setEmailError('');
          setPasswordError('');

          return true;
}

const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateFields()) {
        try {
            const data = await loginUser(email, password);
            if (data.token) {
                Cookies.set('authToken', data.token, { expires: 7 });
                navigate('/');
                location.reload();
            } else if (data.error) {
                if(data.error === "Invalid credentials")
                triggerAlert('Такого користувача не існує!', 'error');
                else
                    triggerAlert('Неправильинй пароль!', 'error');
            }
        } catch (error) {
            triggerAlert('Щось пішло не так...', 'error');
        }
    } else {
        console.log('Form failed to validate');
    }
}

return(
    <div className = "form-container">

        <div className = "input-fields">
            <div className="input" style={{ border: emailError ? '1px solid red' : '1px solid #ccc' }}>
                <img src ={EmailIcon} alt = ""/>
                <input
                type = "email"
                placeholder = "E-mail"
                value={email}
                onChange={handleEmailChange}
                />
            </div>
             {emailError && <p className = "error-message">{emailError}</p>}
            <div className ="input" style={{ border: passwordError ? '1px solid red' : '1px solid #ccc' }}>
                <img src ={PassIcon}/>
                <input
                type = {showPassword ? 'text' : 'password'}
                placeholder = "Пароль"
                value={password}
                onChange={handlePasswordChange}/>
                <img className = "button-hide-show"
                   src = {showPassword ? ShowIcon : HideIcon}
                   alt={showPassword ? "Hide Password" : "Show Password"}
                   onClick={togglePasswordVisibility}

                />
            </div>
            {passwordError && <p className="error-message">{passwordError}</p>}
        </div>
        <button className="submit-button" onClick={handleSubmit}>Увійти</button>
        <div>
            <span className="link-button" onClick = {() => onSwitchForm('resetPassword')} >Забули пароль?</span>
        </div>
        <div>
           <span className="link-button" onClick = {() => onSwitchForm('signUp')}> Реєстрація нового користувача </span>
        </div>
        <h2>Увійдіть за допомогою</h2>
         <button className="google-button">
                <img src ={GoogleIcon}/>
                Google
         </button>
    </div>
     );
}
export default LogIn;