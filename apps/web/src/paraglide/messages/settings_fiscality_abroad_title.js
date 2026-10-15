/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Fiscality_Abroad_TitleInputs */



/**
* | output |
* | --- |
* | "Tax features are France-only" |
*
* @param {Settings_Fiscality_Abroad_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_fiscality_abroad_title = /** @type {((inputs?: Settings_Fiscality_Abroad_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Fiscality_Abroad_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Fiscalité limitée à la France")
	return /** @type {LocalizedString} */ ("Tax features are France-only")
});