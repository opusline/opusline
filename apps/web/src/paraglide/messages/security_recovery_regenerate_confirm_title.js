/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Security_Recovery_Regenerate_Confirm_TitleInputs */



/**
* | output |
* | --- |
* | "Generate new recovery codes?" |
*
* @param {Security_Recovery_Regenerate_Confirm_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const security_recovery_regenerate_confirm_title = /** @type {((inputs?: Security_Recovery_Regenerate_Confirm_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Security_Recovery_Regenerate_Confirm_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Générer de nouveaux codes de secours ?")
	return /** @type {LocalizedString} */ ("Generate new recovery codes?")
});