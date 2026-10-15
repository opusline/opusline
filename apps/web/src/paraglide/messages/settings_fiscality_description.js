/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Fiscality_DescriptionInputs */



/**
* | output |
* | --- |
* | "These values drive the provisions and deadlines the app computes." |
*
* @param {Settings_Fiscality_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_fiscality_description = /** @type {((inputs?: Settings_Fiscality_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Fiscality_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Ces valeurs pilotent les provisions et les échéances calculées par l'app.")
	return /** @type {LocalizedString} */ ("These values drive the provisions and deadlines the app computes.")
});