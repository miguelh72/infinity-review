import { FormatError } from '../src/errors';
import { validateLink, validateName } from '../src/validate';

/* write test for validateName */
test('valid names', () => {
	expect(() => validateName('John Doe')).not.toThrow(Error);
	expect(() => validateName('Wait we mean material names, not people!')).not.toThrow(Error);
});

test('throw TypeError and FormatError for invalid names', () => {
	expect(() => validateName(1337)).toThrow(TypeError);
	expect(() => validateName('')).toThrow(FormatError);
});

test('valid urls', () => {
	expect(() => validateLink('www.example.com')).not.toThrow(Error);
	expect(() => validateLink('http://justwords.com')).not.toThrow(Error);
	expect(() => validateLink('https://justwords.com')).not.toThrow(Error);
	expect(() => validateLink('https://www.justwords.com')).not.toThrow(Error);
	expect(() => validateLink('https://ww3.justwords.com')).not.toThrow(Error);
	expect(() => validateLink('www.example.io')).not.toThrow(Error);
	expect(() => validateLink('www.example.random')).not.toThrow(Error);
	expect(() => validateLink('www.example.com/kittens')).not.toThrow(Error);
	expect(() => validateLink('www.example.com/kittens/food/love/343434/img.jpg')).not.toThrow(Error);
});

test('throw FormatError for invalid url', () => {
	expect(() => validateLink('')).toThrow(FormatError);
	expect(() => validateLink('justwords')).toThrow(FormatError);
	expect(() => validateLink('justwords.com')).toThrow(FormatError);
	expect(() => validateLink('badboyswhatyougunnado')).toThrow(FormatError);
	expect(() => validateLink('www.justwords')).toThrow(FormatError);
	expect(() => validateLink('htp://justwords.com')).toThrow(FormatError);
});
