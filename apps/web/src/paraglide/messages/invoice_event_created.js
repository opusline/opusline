/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoice_Event_CreatedInputs */

const en_invoice_event_created = /** @type {(inputs: Invoice_Event_CreatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoice created`)
};

const fr_invoice_event_created = /** @type {(inputs: Invoice_Event_CreatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facture créée`)
};

/**
* | output |
* | --- |
* | "Invoice created" |
*
* @param {Invoice_Event_CreatedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoice_event_created = /** @type {((inputs?: Invoice_Event_CreatedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoice_Event_CreatedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoice_event_created(inputs)
	return en_invoice_event_created(inputs)
});