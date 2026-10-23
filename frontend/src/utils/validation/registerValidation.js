import { validateConfirmPassword, validateEmail, validateName, validatePassword, validatePhoneNumber } from "./validationRules";

export default function validareRegister(inputs){
    const errors = {};
    const nameError = validateName(inputs.name);
    if(nameError){
        errors.name = nameError;
    }

    const emailError = validateEmail(inputs.email);
    if(emailError){
        errors.email = emailError;
    }

    const passwordError = validatePassword(inputs.password);
    if(passwordError){
        errors.password = passwordError;
    }

    const confirmPasswordError = validateConfirmPassword(inputs.confirmPassword, inputs.password);
    if(confirmPasswordError){
        errors.confirmPassword = confirmPasswordError;
    }

    const phoneError = validatePhoneNumber(inputs.phoneNumber);
    if(phoneError){
        errors.phoneNumber = phoneError;
    }
    return errors;
}