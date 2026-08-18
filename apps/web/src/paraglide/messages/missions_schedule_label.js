/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Schedule_LabelInputs */

const en_missions_schedule_label = /** @type {(inputs: Missions_Schedule_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Label`)
};

const fr_missions_schedule_label = /** @type {(inputs: Missions_Schedule_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Libellé`)
};

/**
* | output |
* | --- |
* | "Label" |
*
* @param {Missions_Schedule_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_schedule_label = /** @type {((inputs?: Missions_Schedule_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Schedule_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_schedule_label(inputs)
	return en_missions_schedule_label(inputs)
});