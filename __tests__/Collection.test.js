import Collection from '../src/Collection';
import { FormatError } from '../src/errors';
import Material from '../src/Material';

test('create Collection', () => {
	const algorithm = Collection.allowedAlgorithms[0];
	const schedule = Collection.allowedSchedules[0];
	const material = new Material('name', 'http://www.example.com');

	let collection = new Collection();
	expect(collection).toBeInstanceOf(Collection);
	expect(collection.getMaterialList()).toBeInstanceOf(Array);
	expect(collection.getMaterialList().length).toBe(0);
	expect(collection.algorithm).toBe('sequential');
	expect(collection.schedule).toBe('daily');

	collection = new Collection(schedule, algorithm, material, material);
	expect(collection.algorithm).toBe(algorithm);
	expect(collection.schedule).toBe(schedule);
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
	const algorithm = Collection.allowedAlgorithms[0];
	const schedule = Collection.allowedSchedules[0];
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
	const material = new Material('name', 'http://www.example.com');

	let collection = new Collection(Collection.allowedAlgorithms[0], Collection.allowedSchedules[0], material);
	expect(collection.algorithm).not.toBe(algorithm);
	expect(collection.schedule).not.toBe(schedule);

	expect(() => (collection.algorithm = 101)).toThrow(TypeError);
	expect(() => (collection.algorithm = 'notanalgorithm')).toThrow(FormatError);
	expect(() => (collection.schedule = 101)).toThrow(TypeError);
	expect(() => (collection.schedule = 'once-in-a-lifetime')).toThrow(FormatError);

	collection.algorithm = algorithm;
	collection.schedule = schedule;
	expect(collection.algorithm).toBe(algorithm);
	expect(collection.schedule).toBe(schedule);
});

test('remove material', () => {
	const algorithm = Collection.allowedAlgorithms[0];
	const schedule = Collection.allowedSchedules[0];
	const material1 = new Material('name', 'http://www.example.com');
	const material2 = new Material('name2', 'www.anotherexample.com');

	let collection = new Collection(schedule, algorithm, material1, material2);
	collection.removeMaterialAtIndex(1);
	expect(collection.getMaterialList()).toBeInstanceOf(Array);
	expect(collection.getMaterialList().length).toBe(1);
	expect(collection.getMaterialList()[0]).not.toBe(material1); // method must return deep copy of array
	expect(collection.getMaterialList()[0]).toMatchObject(material1);
	expect(collection.getMaterialList()[0]).toBeInstanceOf(Material);

	collection = new Collection(schedule, algorithm, material1, material2);
	collection.removeMaterialAtIndex(0);
	expect(collection.getMaterialList()).toBeInstanceOf(Array);
	expect(collection.getMaterialList().length).toBe(1);
	expect(collection.getMaterialList()[0]).not.toBe(material2);
	expect(collection.getMaterialList()[0]).toMatchObject(material2);
	expect(collection.getMaterialList()[0]).toBeInstanceOf(Material);

	collection = new Collection(schedule, algorithm, material1, material2);
	collection.removeMaterialAtIndex(0).removeMaterialAtIndex(0);
	expect(collection.getMaterialList()).toBeInstanceOf(Array);
	expect(collection.getMaterialList().length).toBe(0);
	expect(() => collection.removeMaterialAtIndex(0)).toThrow(RangeError);
	expect(() => collection.removeMaterialAtIndex('daffy duck')).toThrow(TypeError);
});
