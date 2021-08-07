import { FormatError } from './errors.js';
import Material from './Material.js';

export default class Collection {
	/**
	 *
	 * @param {string} schedule Notification schedule. Choose between 'daily', 'every-other-day', 'weekly'.
	 * @param {string} algorithm Approach used to find next material to display. Choose between 'sequential', 'semi-random', 'time-weighed-least-reviewed'
	 * @param  {...Material} materials (optional) all additional parameters are initial material to populate the list with
	 */
	constructor(schedule = 'daily', algorithm = 'sequential', ...materials) {
		this._schedule = schedule;
		this._algorithm = algorithm;
		this._materialArray = [];
		this.addMaterial(...materials);
	}

	set schedule(newSchedule) {
		if (typeof newSchedule !== 'string') {
			throw new TypeError('schedule must be of type string');
		}
		if (!Collection.allowedSchedules.includes(newSchedule)) {
			throw new FormatError(`schedule must be on of the following: ${Collection.allowedSchedules.join(', ')}.`);
		}

		this._schedule = newSchedule;
	}
	get schedule() {
		return this._schedule;
	}

	set algorithm(newAlgorithm) {
		if (typeof newAlgorithm !== 'string') {
			throw new TypeError('algorithm must be of type string');
		}
		if (!Collection.allowedAlgorithms.includes(newAlgorithm)) {
			throw new FormatError(`algorithm must be on of the following: ${Collection.allowedAlgorithms.join(', ')}.`);
		}

		this._algorithm = newAlgorithm;
	}
	get algorithm() {
		return this._algorithm;
	}

	addMaterial(...materialArray) {
		// store in all or nothing approach
		const newMaterials = [];
		for (const material of materialArray) {
			if (!(material instanceof Material)) {
				throw new TypeError('constructor material arguments must have Material.prototype in prototype chain');
			}
			newMaterials.push(material);
		}
		this._materialArray = this._materialArray.concat(newMaterials);
	}

	getMaterialList() {
		return this._materialArray.map((material) => {
			return Object.assign(Object.create(Material.prototype), material);
		});
	}

	removeMaterialAtIndex(index) {
		if (typeof index !== 'number') {
			throw new TypeError('index must be of type number');
		}
		if (index < 0 || index >= this._materialArray.length) {
			throw new RangeError('index is out of bounds');
		}

		this._materialArray.splice(index, 1);
		return this;
	}
}
Collection.allowedSchedules = ['daily', 'every-other-day', 'weekly'];
Collection.allowedAlgorithms = ['sequential', 'semi-random', 'time-weighed-least-reviewed'];
