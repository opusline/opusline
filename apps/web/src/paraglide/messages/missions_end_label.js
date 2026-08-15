/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_End_LabelInputs */

const en_missions_end_label = /** @type {(inputs: Missions_End_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Planned end`)
};

const fr_missions_end_label = /** @type {(inputs: Missions_End_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fin prévue`)
};

/**
* | output |
* | --- |
* | "Planned end" |
*
* @param {Missions_End_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_end_label = /** @type {((inputs?: Missions_End_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_End_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_end_label(inputs)
	return en_missions_end_label(inputs)
});