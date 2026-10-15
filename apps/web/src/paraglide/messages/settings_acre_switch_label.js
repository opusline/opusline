/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Acre_Switch_LabelInputs */



/**
* | output |
* | --- |
* | "I benefit from the ACRE" |
*
* @param {Settings_Acre_Switch_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_acre_switch_label = /** @type {((inputs?: Settings_Acre_Switch_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Acre_Switch_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Je bénéficie de l'ACRE")
	return /** @type {LocalizedString} */ ("I benefit from the ACRE")
});