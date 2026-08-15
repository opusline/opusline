/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Rounding_LabelInputs */

const en_missions_rounding_label = /** @type {(inputs: Missions_Rounding_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Entry rounding`)
};

const fr_missions_rounding_label = /** @type {(inputs: Missions_Rounding_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Arrondi des entrées`)
};

/**
* | output |
* | --- |
* | "Entry rounding" |
*
* @param {Missions_Rounding_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_rounding_label = /** @type {((inputs?: Missions_Rounding_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Rounding_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_rounding_label(inputs)
	return en_missions_rounding_label(inputs)
});