import { FormatError } from './errors.js';
import Material from './Material.js';

export default class Collection {
	/**
	 *
	 * @param {string} schedule Notification schedule. Choose between 'daily', 'every-other-day', 'weekly'.
	 * @param {string} algorithm Approach used to find next material to display. Choose between 'sequential', 'semi-random', 'time-weighed-least-reviewed'
	 * @param  {...Material} materials (optional) all additional parameters are initial material to populate the list with
	 */
	constructor(schedule = 'daily', algorithm = 'sequential', lastNotified = Date.now(), ...materials) {
		this.schedule = schedule;
		this.algorithm = algorithm;
		this.lastNotified = lastNotified;
		this._materialArray = [];
		this._lastMaterialIndex;
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

	set lastNotified(newLastNotified) {
		if (typeof newLastNotified !== 'number') {
			throw new TypeError('lastNotified must be a number');
		}
		if (newLastNotified < 1596768910196) {
			// one year before this line was written
			throw new RangeError('lastNotified must be UNIX epoch milliseconds');
		}

		this._lastNotified = newLastNotified;
	}
	get lastNotified() {
		return this._lastNotified;
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

	hasNotification() {
		if (this._materialArray.length === 0) {
			return false;
		}

		const lastUpdateDateString = new Date(this._lastNotified).toDateString();
		const todayDateString = new Date().toDateString();
		switch (this._schedule) {
			case 'daily':
				return new Date(this._lastNotified).getDate() !== new Date().getDate();
			case 'every-other-day':
				// more than one day in between means they are more than two days apart counting by start of each day
				return new Date(todayDateString).getTime() - new Date(lastUpdateDateString).getTime() > 24 * 60 * 60 * 1000;
			case 'weekly':
				// more than 6 day in between means they are more than two days apart counting by start of each day
				return new Date(todayDateString).getTime() - new Date(lastUpdateDateString).getTime() > 6 * 24 * 60 * 60 * 1000;
			default:
				throw new Error('hasNotification could not handle schedule equal to ' + this._schedule);
		}
	}

	getNextMaterialToNotify() {
		if (this._materialArray.length === 0) {
			throw new RangeError('there are no materials in collection');
		}

		this._lastMaterialIndex = this._lastMaterialIndex ?? 0;
		if (this._lastMaterialIndex >= this._materialArray.length) {
			this._lastMaterialIndex = 0;
		}
		return this._materialArray[this._lastMaterialIndex++];
	}
}
Collection.allowedSchedules = ['daily', 'every-other-day', 'weekly'];
Collection.allowedAlgorithms = ['sequential', 'semi-random', 'time-weighed-least-reviewed'];
