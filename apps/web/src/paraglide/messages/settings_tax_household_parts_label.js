/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Tax_Household_Parts_LabelInputs */



/**
* | output |
* | --- |
* | "Household tax parts" |
*
* @param {Settings_Tax_Household_Parts_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_tax_household_parts_label = /** @type {((inputs?: Settings_Tax_Household_Parts_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Tax_Household_Parts_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Parts du foyer")
	return /** @type {LocalizedString} */ ("Household tax parts")
});