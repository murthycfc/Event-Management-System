
export function validateName(name){
    if(!name.trim()){
        return "Name is required";
    }
    if(name.trim().length<3){
        return "Name must be at least 3 characters"
    }
    return "";
}

export function validateEmail(email){
    if(!email.trim()){
        return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return "Please enter a valid email"
    }
    return "";
}

export function validatePassword(password){
    if(!password.trim()){
        return "Password is required";
    }
    if(password.trim().length<6){
        return "Password must be at least 6 characters";
    }
    return "";
}

export function validateConfirmPassword(confirmPassword, password){
    if(!confirmPassword.trim()){
        return "Confirm Password is required";
    }
    if(confirmPassword!==password){
        return "Confirm Password must be equal to entered Password";
    }
    return "";
}

export function validatePhoneNumber(phoneNumber){
    if(!phoneNumber){
        return "Phone number is required"
    }
    const phoneRegex = /^[6-9]\d{9}$/
    if(!phoneRegex.test(phoneNumber)){
        return "Please enter a valid 10-digit phone number"
    }
    return "";

}