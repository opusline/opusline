/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Invoice_Number_HintInputs */



/**
* | output |
* | --- |
* | "Available tokens: AAAA (year), MM (month), NNN (counter)." |
*
* @param {Settings_Invoice_Number_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_invoice_number_hint = /** @type {((inputs?: Settings_Invoice_Number_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Invoice_Number_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Jetons disponibles : AAAA (année), MM (mois), NNN (compteur).")
	return /** @type {LocalizedString} */ ("Available tokens: AAAA (year), MM (month), NNN (counter).")
});