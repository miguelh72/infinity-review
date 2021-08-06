import { FormatError } from "./errors.js";

export function validateName(name) {
    if (typeof name !== 'string') {
        throw new TypeError('name must be of type string');
    }
    if (name.length === 0) {
        throw new FormatError('name can not be an empty string');
    }
}

export function validateLink(link) {
    if (typeof link !== 'string') {
        throw new TypeError('name must be of type string');
    }
    if (!link.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/i)) {
        throw new FormatError('link was not a valid external URL');
    }
}