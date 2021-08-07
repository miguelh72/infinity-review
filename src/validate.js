import { FormatError } from './errors.js';

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
	if (!link.match(/(http:\/\/|ftp:\/\/|https:\/\/|www)+[(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gm)) {
		throw new FormatError('link was not a valid external URL');
	}
}
