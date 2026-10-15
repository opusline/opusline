/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Start_LabelInputs */

const en_missions_start_label = /** @type {(inputs: Missions_Start_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Start`)
};

const fr_missions_start_label = /** @type {(inputs: Missions_Start_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Début`)
};

/**
* | output |
* | --- |
* | "Start" |
*
* @param {Missions_Start_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_start_label = /** @type {((inputs?: Missions_Start_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Start_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_start_label(inputs)
	return en_missions_start_label(inputs)
});