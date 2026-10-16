/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_Status_AcceptedInputs */

const en_quote_status_accepted = /** @type {(inputs: Quote_Status_AcceptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Accepted`)
};

const fr_quote_status_accepted = /** @type {(inputs: Quote_Status_AcceptedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Accepté`)
};

/**
* | output |
* | --- |
* | "Accepted" |
*
* @param {Quote_Status_AcceptedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_status_accepted = /** @type {((inputs?: Quote_Status_AcceptedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Status_AcceptedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_status_accepted(inputs)
	return en_quote_status_accepted(inputs)
});