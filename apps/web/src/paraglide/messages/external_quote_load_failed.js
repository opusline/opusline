/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} External_Quote_Load_FailedInputs */

const en_external_quote_load_failed = /** @type {(inputs: External_Quote_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The clients could not be loaded.`)
};

const fr_external_quote_load_failed = /** @type {(inputs: External_Quote_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les clients n'ont pas pu être chargés.`)
};

/**
* | output |
* | --- |
* | "The clients could not be loaded." |
*
* @param {External_Quote_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const external_quote_load_failed = /** @type {((inputs?: External_Quote_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<External_Quote_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_external_quote_load_failed(inputs)
	return en_external_quote_load_failed(inputs)
});