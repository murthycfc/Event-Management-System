import { validateEmail, validatePassword } from "./validationRules";

export default function validateLogin(inputs){
    const errors = {};
    const emailError = validateEmail(inputs.email);
    if(emailError){
        errors.email = emailError;
    }

    const passwordError  = validatePassword(inputs.password);
    if(passwordError){
        errors.password = passwordError;
    }

    return errors;
}