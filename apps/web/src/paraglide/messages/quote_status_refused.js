/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_Status_RefusedInputs */

const en_quote_status_refused = /** @type {(inputs: Quote_Status_RefusedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Refused`)
};

const fr_quote_status_refused = /** @type {(inputs: Quote_Status_RefusedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Refusé`)
};

/**
* | output |
* | --- |
* | "Refused" |
*
* @param {Quote_Status_RefusedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_status_refused = /** @type {((inputs?: Quote_Status_RefusedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Status_RefusedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_status_refused(inputs)
	return en_quote_status_refused(inputs)
});