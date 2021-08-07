import Collection from '../src/Collection';
import { FormatError } from '../src/errors';
import Material from '../src/Material';

test('create Collection', () => {
	const algorithm = Collection.allowedAlgorithms[0];
	const schedule = Collection.allowedSchedules[0];
	const lastNotified = Date.now() - 500;
	const material = new Material('name', 'http://www.example.com');

	let collection = new Collection();
	expect(collection).toBeInstanceOf(Collection);
	expect(collection.getMaterialList()).toBeInstanceOf(Array);
	expect(collection.getMaterialList().length).toBe(0);
	expect(collection.algorithm).toBe('sequential');
	expect(collection.schedule).toBe('daily');
	expect(Math.abs(collection.lastNotified - lastNotified - 500)).toBeLessThan(2); // allow less than 2 ms run time

	collection = new Collection(schedule, algorithm, lastNotified, material, material);
	expect(collection.algorithm).toBe(algorithm);
	expect(collection.schedule).toBe(schedule);
	expect(collection.lastNotified).toBe(lastNotified);
	expect(collection.getMaterialList()).toBeInstanceOf(Array);
	expect(collection.getMaterialList().length).toBe(2);
	expect(collection.getMaterialList()[0]).not.toBe(material);
	expect(collection.getMaterialList()[0]).toMatchObject(material);
	expect(collection.getMaterialList()[0]).toBeInstanceOf(Material);
	expect(collection.getMaterialList()[1]).not.toBe(material);
	expect(collection.getMaterialList()[1]).toMatchObject(material);
	expect(collection.getMaterialList()[1]).toBeInstanceOf(Material);
});

test('add material', () => {
	const material1 = new Material('name', 'http://www.example.com');
	const material2 = new Material('name2', 'www.anotherexample.com');

	let collection = new Collection();
	collection.addMaterial(material1);
	expect(collection.getMaterialList()).toBeInstanceOf(Array);
	expect(collection.getMaterialList().length).toBe(1);
	expect(collection.getMaterialList()[0]).not.toBe(material1); // method must return deep copy of array
	expect(collection.getMaterialList()[0]).toMatchObject(material1);
	expect(collection.getMaterialList()[0]).toBeInstanceOf(Material);
	collection.addMaterial(material2);
	expect(collection.getMaterialList().length).toBe(2);
	expect(collection.getMaterialList()[0]).not.toBe(material1);
	expect(collection.getMaterialList()[0]).toMatchObject(material1);
	expect(collection.getMaterialList()[0]).toBeInstanceOf(Material);
	expect(collection.getMaterialList()[1]).not.toBe(material2);
	expect(collection.getMaterialList()[1]).toMatchObject(material2);
	expect(collection.getMaterialList()[1]).toBeInstanceOf(Material);
});

test('update Collection', () => {
	const algorithm = Collection.allowedAlgorithms[1];
	const schedule = Collection.allowedSchedules[1];
	const lastNotified = Date.now() - 500;
	const material = new Material('name', 'http://www.example.com');

	let collection = new Collection(Collection.allowedSchedules[0], Collection.allowedAlgorithms[0], Date.now(), material);
	expect(collection.algorithm).not.toBe(algorithm);
	expect(collection.schedule).not.toBe(schedule);

	expect(() => (collection.algorithm = 101)).toThrow(TypeError);
	expect(() => (collection.algorithm = 'notanalgorithm')).toThrow(FormatError);
	expect(() => (collection.schedule = 101)).toThrow(TypeError);
	expect(() => (collection.schedule = 'once-in-a-lifetime')).toThrow(FormatError);
	expect(() => (collection.lastNotified = 'once-in-a-lifetime')).toThrow(TypeError);
	expect(() => (collection.lastNotified = new Date('07/01/2020').getTime())).toThrow(RangeError);

	collection.algorithm = algorithm;
	collection.schedule = schedule;
	collection.lastNotified = lastNotified;
	expect(collection.algorithm).toBe(algorithm);
	expect(collection.schedule).toBe(schedule);
	expect(collection.lastNotified).toBe(lastNotified);
});

test('remove material', () => {
	const algorithm = Collection.allowedAlgorithms[0];
	const schedule = Collection.allowedSchedules[0];
	const material1 = new Material('name', 'http://www.example.com');
	const material2 = new Material('name2', 'www.anotherexample.com');

	let collection = new Collection(schedule, algorithm, Date.now(), material1, material2);
	collection.removeMaterialAtIndex(1);
	expect(collection.getMaterialList()).toBeInstanceOf(Array);
	expect(collection.getMaterialList().length).toBe(1);
	expect(collection.getMaterialList()[0]).not.toBe(material1); // method must return deep copy of array
	expect(collection.getMaterialList()[0]).toMatchObject(material1);
	expect(collection.getMaterialList()[0]).toBeInstanceOf(Material);

	collection = new Collection(schedule, algorithm, Date.now(), material1, material2);
	collection.removeMaterialAtIndex(0);
	expect(collection.getMaterialList()).toBeInstanceOf(Array);
	expect(collection.getMaterialList().length).toBe(1);
	expect(collection.getMaterialList()[0]).not.toBe(material2);
	expect(collection.getMaterialList()[0]).toMatchObject(material2);
	expect(collection.getMaterialList()[0]).toBeInstanceOf(Material);

	collection = new Collection(schedule, algorithm, Date.now(), material1, material2);
	collection.removeMaterialAtIndex(0).removeMaterialAtIndex(0);
	expect(collection.getMaterialList()).toBeInstanceOf(Array);
	expect(collection.getMaterialList().length).toBe(0);
	expect(() => collection.removeMaterialAtIndex(0)).toThrow(RangeError);
	expect(() => collection.removeMaterialAtIndex('daffy duck')).toThrow(TypeError);
});

test('is collection ready to notify', () => {
	const algorithm = Collection.allowedAlgorithms[0];
	const material = new Material('name', 'http://www.example.com');
	const oneDayInMs = 24 * 60 * 60 * 1000;

	let collection = new Collection('daily', algorithm, Date.now() - oneDayInMs - 1);
	// empty collection should not notify
	expect(collection.hasNotification()).toBe(false);

	collection.addMaterial(material);
	expect(collection.hasNotification()).toBe(true);

	collection = new Collection('daily', algorithm, new Date(new Date().toDateString()).getTime(), material);
	expect(collection.hasNotification()).toBe(false);

	collection = new Collection('every-other-day', algorithm, Date.now() - 2 * oneDayInMs);
	expect(collection.hasNotification()).toBe(false);
	collection.addMaterial(material);
	expect(collection.hasNotification()).toBe(true);
	collection = new Collection('every-other-day', algorithm, new Date(new Date().toDateString()).getTime() - oneDayInMs, material);
	expect(collection.hasNotification()).toBe(false);

	collection = new Collection('weekly', algorithm, Date.now() - 7 * oneDayInMs);
	expect(collection.hasNotification()).toBe(false);
	collection.addMaterial(material);
	expect(collection.hasNotification()).toBe(true);
	collection = new Collection('weekly', algorithm, new Date(new Date().toDateString()).getTime() - 6 * oneDayInMs, material);
	expect(collection.hasNotification()).toBe(false);
});
