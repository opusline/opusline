/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Target_Rate_LabelInputs */

const en_missions_target_rate_label = /** @type {(inputs: Missions_Target_Rate_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Target day rate`)
};

const fr_missions_target_rate_label = /** @type {(inputs: Missions_Target_Rate_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`TJM cible`)
};

/**
* | output |
* | --- |
* | "Target day rate" |
*
* @param {Missions_Target_Rate_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_target_rate_label = /** @type {((inputs?: Missions_Target_Rate_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Target_Rate_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_target_rate_label(inputs)
	return en_missions_target_rate_label(inputs)
});