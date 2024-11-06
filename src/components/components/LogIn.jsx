import {useState} from "react";
import '../styles/UnificatedForm.css'
import {  validateEmail, validatePasswordForLogIn } from "../../utils/ValidationService";

const LogIn = ({onSwitchForm}) => {
//TODO
// 1) кнопки "ока" для полів password
// 2) реалізувати форму resetpassword 2
// 3) перекласти все на українську мову
// 4) перенести код до основного бренча
const [email,setEmail] = useState('');
const [emailError, setEmailError] = useState('');
const [password, setPassword] = useState('');
const [passwordError, setPasswordError] = useState('');

const [showPassword,setShowPassword] = useState(false);

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

const handleSubmit = (event) => {
    event.preventDefault();
    if(validateFields()){
        console.log('Form submitted successfully!');
    }
    else{
    console.log('Form failed to success!');
    }
}


return(
    <div className = "form-container">

        <div className = "input-fields">
            <div className="input" style={{ border: emailError ? '1px solid red' : '1px solid #ccc' }}>
                <img src = "./src/assets/email.png" alt = ""/>
                <input
                type = "email"
                placeholder = "E-mail"
                value={email}
                onChange={handleEmailChange}
                />
            </div>
             {emailError && <p className = "error-message">{emailError}</p>}
            <div className ="input" style={{ border: passwordError ? '1px solid red' : '1px solid #ccc' }}>
                <img src ="./src/assets/password.png"/>
                <input
                type = {showPassword ? 'text' : 'password'}
                placeholder = "Пароль"
                value={password}
                onChange={handlePasswordChange}/>
                <img className = "button-hide-show"
                   src = {showPassword ? "./src/assets/icon-show-password-24.png" : "./src/assets/icon-hide-password-30.png"}
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
                <img src = "./src/assets/google_logo.png"/>
                Google
         </button>
    </div>
     );
}
export default LogIn;