/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoice_Remind_NowInputs */

const en_invoice_remind_now = /** @type {(inputs: Invoice_Remind_NowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remind now`)
};

const fr_invoice_remind_now = /** @type {(inputs: Invoice_Remind_NowInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Relancer maintenant`)
};

/**
* | output |
* | --- |
* | "Remind now" |
*
* @param {Invoice_Remind_NowInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoice_remind_now = /** @type {((inputs?: Invoice_Remind_NowInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoice_Remind_NowInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoice_remind_now(inputs)
	return en_invoice_remind_now(inputs)
});