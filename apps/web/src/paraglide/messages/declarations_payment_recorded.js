/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Payment_RecordedInputs */



/**
* | output |
* | --- |
* | "Payment recorded · debited from the business account" |
*
* @param {Declarations_Payment_RecordedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_payment_recorded = /** @type {((inputs?: Declarations_Payment_RecordedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Payment_RecordedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Paiement enregistré · prélèvement sur le compte pro")
	return /** @type {LocalizedString} */ ("Payment recorded · debited from the business account")
});