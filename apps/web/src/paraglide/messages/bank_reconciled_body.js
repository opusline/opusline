/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Reconciled_BodyInputs */



/**
* | output |
* | --- |
* | "Every payment on the statement is linked to its invoice. The next import will pick up here." |
*
* @param {Bank_Reconciled_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_reconciled_body = /** @type {((inputs?: Bank_Reconciled_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Reconciled_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Chaque encaissement du relevé est relié à sa facture. Le prochain import reprendra ici.")
	return /** @type {LocalizedString} */ ("Every payment on the statement is linked to its invoice. The next import will pick up here.")
});