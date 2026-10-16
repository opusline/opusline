/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_Tracking_AcceptedInputs */

const en_quote_tracking_accepted = /** @type {(inputs: Quote_Tracking_AcceptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The client accepted: the invoices will be built on this quote.`)
};

const fr_quote_tracking_accepted = /** @type {(inputs: Quote_Tracking_AcceptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le client a accepté : les factures s'appuieront sur ce devis.`)
};

/**
* | output |
* | --- |
* | "The client accepted: the invoices will be built on this quote." |
*
* @param {Quote_Tracking_AcceptedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_tracking_accepted = /** @type {((inputs?: Quote_Tracking_AcceptedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Tracking_AcceptedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_tracking_accepted(inputs)
	return en_quote_tracking_accepted(inputs)
});