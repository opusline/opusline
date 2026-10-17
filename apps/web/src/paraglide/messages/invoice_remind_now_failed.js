/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoice_Remind_Now_FailedInputs */

const en_invoice_remind_now_failed = /** @type {(inputs: Invoice_Remind_Now_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The reminder could not be sent.`)
};

const fr_invoice_remind_now_failed = /** @type {(inputs: Invoice_Remind_Now_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La relance n'a pas pu être envoyée.`)
};

/**
* | output |
* | --- |
* | "The reminder could not be sent." |
*
* @param {Invoice_Remind_Now_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoice_remind_now_failed = /** @type {((inputs?: Invoice_Remind_Now_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoice_Remind_Now_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoice_remind_now_failed(inputs)
	return en_invoice_remind_now_failed(inputs)
});