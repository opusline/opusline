/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Movements_Source_ManualInputs */



/**
* | output |
* | --- |
* | "Entered by hand · no statement imported" |
*
* @param {Bank_Movements_Source_ManualInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_movements_source_manual = /** @type {((inputs?: Bank_Movements_Source_ManualInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Movements_Source_ManualInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Saisis à la main · aucun relevé importé")
	return /** @type {LocalizedString} */ ("Entered by hand · no statement imported")
});