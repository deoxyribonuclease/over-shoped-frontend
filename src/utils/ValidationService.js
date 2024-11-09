export const validateName = (name) => {
    if(name.trim().length === 0){
        return 'Поле імені не може бути пустим';
    }
    return '';
}
export const validateEmail = (email) => {
       if(email.trim().length === 0){
        return 'Поле пошти не може бути пустим.';
       }
       if (email.includes(" ")) {
           return "Пошта не може мати пробілів.";
       }
       if (!email.includes("@") || !email.includes(".")) {
           return "Пошта має включати '@' і валідний домен'.' ";
       }
       if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
           return 'Неправильний формат пошти!';
       }
       return '';
};

export const validatePasswordForSignUp = (password) => {
    if(password.trim().length === 0){
        return 'Це поле не може бути пустим!';
    }
    if (password.length < 6) {
        return 'Пароль має бути як мінімум шість символів!';
    }
    return '';
};
export const validatePasswordForLogIn = (password) => {
    if(password.trim().length === 0){
        return 'Це поле не може бути пустим!';
    }
    return '';
};

export const validateRepeatPassword = (password, repeatPassword) => {
    if(repeatPassword.trim().length === 0){
        return 'Це поле не може бути пустим!';
    }
    if (password !== repeatPassword) {
        return 'Паролі не співпадають!';
    }
    return '';
};
