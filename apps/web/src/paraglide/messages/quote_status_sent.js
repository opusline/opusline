/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_Status_SentInputs */

const en_quote_status_sent = /** @type {(inputs: Quote_Status_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sent`)
};

const fr_quote_status_sent = /** @type {(inputs: Quote_Status_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Envoyé`)
};

/**
* | output |
* | --- |
* | "Sent" |
*
* @param {Quote_Status_SentInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_status_sent = /** @type {((inputs?: Quote_Status_SentInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Status_SentInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_status_sent(inputs)
	return en_quote_status_sent(inputs)
});