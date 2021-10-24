import { FormatError } from './errors';

export function validateName(name: string): void {
	// TODO properly validate name using regex

	if (name.length === 0) {
		throw new FormatError('name can not be an empty string');
	}
}

export function validateLink(link: string): void {
	if (!link.match(/(http:\/\/|ftp:\/\/|https:\/\/|www)+[(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gm)) {
		throw new FormatError('link was not a valid external URL');
	}
}
