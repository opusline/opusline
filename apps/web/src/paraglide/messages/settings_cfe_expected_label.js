/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Cfe_Expected_LabelInputs */



/**
* | output |
* | --- |
* | "Expected annual CFE" |
*
* @param {Settings_Cfe_Expected_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_cfe_expected_label = /** @type {((inputs?: Settings_Cfe_Expected_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Cfe_Expected_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("CFE annuelle attendue")
	return /** @type {LocalizedString} */ ("Expected annual CFE")
});