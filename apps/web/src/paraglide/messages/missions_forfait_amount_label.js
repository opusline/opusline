/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Missions_Forfait_Amount_LabelInputs */

const en_missions_forfait_amount_label = /** @type {(inputs: Missions_Forfait_Amount_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fixed price amount`)
};

const fr_missions_forfait_amount_label = /** @type {(inputs: Missions_Forfait_Amount_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Montant du forfait`)
};

/**
* | output |
* | --- |
* | "Fixed price amount" |
*
* @param {Missions_Forfait_Amount_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_forfait_amount_label = /** @type {((inputs?: Missions_Forfait_Amount_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Forfait_Amount_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_forfait_amount_label(inputs)
	return en_missions_forfait_amount_label(inputs)
});