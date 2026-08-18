/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Schedule_DueInputs */

const en_missions_schedule_due = /** @type {(inputs: Missions_Schedule_DueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expected on`)
};

const fr_missions_schedule_due = /** @type {(inputs: Missions_Schedule_DueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prévue le`)
};

/**
* | output |
* | --- |
* | "Expected on" |
*
* @param {Missions_Schedule_DueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_schedule_due = /** @type {((inputs?: Missions_Schedule_DueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Schedule_DueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_schedule_due(inputs)
	return en_missions_schedule_due(inputs)
});