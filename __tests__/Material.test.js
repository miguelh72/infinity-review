import { FormatError } from '../src/errors';
import Material from '../src/Material';

test('create Material object', () => {
	const name = 'test name';
	const url = 'www.example.com';
	const lastUpdated = Date.now() - 500;
	const timesReviewed = 5;

	let material = new Material(name, url);
	expect(typeof material).toBe('object');
	expect(material).toBeInstanceOf(Material);
	expect(material.name).toBe(name);
	expect(material.link).toBe(url);
	expect(material.lastUpdated).toBeLessThan(Date.now() + 1);
	expect(material.timesReviewed).toBe(0);

	material = new Material(name + 'a', url + '/test', lastUpdated, timesReviewed);
	expect(typeof material).toBe('object');
	expect(material).toBeInstanceOf(Material);
	expect(material.name).toBe(name + 'a');
	expect(material.link).toBe(url + '/test');
	expect(material.lastUpdated).toBe(lastUpdated);
	expect(material.timesReviewed).toBe(timesReviewed);
});

test('modify Material object', () => {
	const name = 'test name';
	const url = 'www.example.com';
	const lastUpdated = Date.now();
	const timesReviewed = 5;

	let material = new Material(name, url);
	material.name += 'a';
	// \/ Must be called before .lastUpdated, because it sets this value to Date.now()
	material.link += '/test';
	material.timesReviewed = timesReviewed;
	material.lastUpdated = lastUpdated;
	expect(typeof material).toBe('object');
	expect(material).toBeInstanceOf(Material);
	expect(material.name).toBe(name + 'a');
	expect(material.link).toBe(url + '/test');
	expect(material.timesReviewed).toBe(timesReviewed);
	expect(material.lastUpdated).toBe(lastUpdated);
});

test('edge cases', () => {
	const name = 'test name';
	const url = 'www.example.com';

	let material = new Material(name, url);
	expect(() => (material.name = 5)).toThrow(TypeError);
	expect(() => (material.link = 'badboyswhatyougunnado')).toThrow(FormatError);
	expect(() => (material.timesReviewed = 'hello world')).toThrow(TypeError);
	expect(() => (material.timesReviewed = -2)).toThrow(RangeError);
	expect(() => (material.lastUpdated = 'beep boop')).toThrow(TypeError);
	expect(() => (material.lastUpdated = new Date('07/01/2020').getTime())).toThrow(RangeError);
});
