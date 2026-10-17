/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Credit_Note_Reason_Billing_ErrorInputs */

const en_credit_note_reason_billing_error = /** @type {(inputs: Credit_Note_Reason_Billing_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Billing error`)
};

const fr_credit_note_reason_billing_error = /** @type {(inputs: Credit_Note_Reason_Billing_ErrorInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Erreur de facturation`)
};

/**
* | output |
* | --- |
* | "Billing error" |
*
* @param {Credit_Note_Reason_Billing_ErrorInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const credit_note_reason_billing_error = /** @type {((inputs?: Credit_Note_Reason_Billing_ErrorInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Credit_Note_Reason_Billing_ErrorInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_credit_note_reason_billing_error(inputs)
	return en_credit_note_reason_billing_error(inputs)
});