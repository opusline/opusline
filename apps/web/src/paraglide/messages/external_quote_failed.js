/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} External_Quote_FailedInputs */

const en_external_quote_failed = /** @type {(inputs: External_Quote_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The quote could not be added.`)
};

const fr_external_quote_failed = /** @type {(inputs: External_Quote_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le devis n'a pas pu être ajouté.`)
};

/**
* | output |
* | --- |
* | "The quote could not be added." |
*
* @param {External_Quote_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const external_quote_failed = /** @type {((inputs?: External_Quote_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<External_Quote_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_external_quote_failed(inputs)
	return en_external_quote_failed(inputs)
});