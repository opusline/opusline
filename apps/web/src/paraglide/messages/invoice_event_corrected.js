/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoice_Event_CorrectedInputs */

const en_invoice_event_corrected = /** @type {(inputs: Invoice_Event_CorrectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Amount corrected`)
};

const fr_invoice_event_corrected = /** @type {(inputs: Invoice_Event_CorrectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Montant corrigé`)
};

/**
* | output |
* | --- |
* | "Amount corrected" |
*
* @param {Invoice_Event_CorrectedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoice_event_corrected = /** @type {((inputs?: Invoice_Event_CorrectedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoice_Event_CorrectedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoice_event_corrected(inputs)
	return en_invoice_event_corrected(inputs)
});