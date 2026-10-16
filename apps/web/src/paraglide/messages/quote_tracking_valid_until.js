/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_Tracking_Valid_UntilInputs */

const en_quote_tracking_valid_until = /** @type {(inputs: Quote_Tracking_Valid_UntilInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Valid until`)
};

const fr_quote_tracking_valid_until = /** @type {(inputs: Quote_Tracking_Valid_UntilInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Valable jusqu'au`)
};

/**
* | output |
* | --- |
* | "Valid until" |
*
* @param {Quote_Tracking_Valid_UntilInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_tracking_valid_until = /** @type {((inputs?: Quote_Tracking_Valid_UntilInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Tracking_Valid_UntilInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_tracking_valid_until(inputs)
	return en_quote_tracking_valid_until(inputs)
});