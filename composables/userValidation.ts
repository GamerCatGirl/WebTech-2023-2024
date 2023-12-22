const NAME_REGEX = /^[A-z0-9-_]{4,22}$/;
const PASSWORD_REGEX = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,22}$/;
var EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;

export function checkValidUsername(name: string): boolean {
    return NAME_REGEX.test(name);
}

export function checkValidPassword(password: string): boolean {
    return PASSWORD_REGEX.test(password);
}

export function checkValidEmail(email: string): boolean {
    return EMAIL_REGEX.test(email);
}