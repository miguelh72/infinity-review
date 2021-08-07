import { validateLink, validateName } from './validate.js';

export default class Material {
	/**
	 * Create a study material object.
	 * @param {string} name Name of material
	 * @param {string} link Valid URL of material
	 * @param {number} lastUpdated (optional) UNIX epoch time of last update.
	 * @param {number} timesReviewed (optional) Number of times this material has been reviewed
	 */
	constructor(name, link, lastUpdated, timesReviewed = 0) {
		Object.assign(this, { name, link, timesReviewed });
		if (lastUpdated !== undefined) {
			this.lastUpdated = lastUpdated;
		}
	}

	set name(newName) {
		validateName(newName);
		this._name = newName;
	}
	get name() {
		return this._name;
	}

	set link(newLink) {
		validateLink(newLink);
		this._link = newLink;
		this._lastUpdated = Date.now();
	}
	get link() {
		return this._link;
	}

	set timesReviewed(newTimesReviewed) {
		if (typeof newTimesReviewed !== 'number') {
			throw new TypeError('timesReviewed must be a number');
		}
		if (newTimesReviewed < 0) {
			throw new RangeError('timesReviewed must be greater than or equal to 0');
		}
		this._timesReviewed = newTimesReviewed;
	}
	get timesReviewed() {
		return this._timesReviewed;
	}

	set lastUpdated(newLastUpdated) {
		if (typeof newLastUpdated !== 'number') {
			throw new TypeError('lastUpdated must be a number');
		}
		if (newLastUpdated < 1596768910196) {
			// one year before time this line was written
			throw new RangeError('lastUpdated must be UNIX epoch milliseconds');
		}
		this._lastUpdated = newLastUpdated;
	}
	get lastUpdated() {
		return this._lastUpdated;
	}
}
