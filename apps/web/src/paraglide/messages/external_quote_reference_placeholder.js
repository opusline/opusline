/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} External_Quote_Reference_PlaceholderInputs */

const en_external_quote_reference_placeholder = /** @type {(inputs: External_Quote_Reference_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`DEV-118`)
};

const fr_external_quote_reference_placeholder = /** @type {(inputs: External_Quote_Reference_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`DEV-118`)
};

/**
* | output |
* | --- |
* | "DEV-118" |
*
* @param {External_Quote_Reference_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const external_quote_reference_placeholder = /** @type {((inputs?: External_Quote_Reference_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<External_Quote_Reference_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_external_quote_reference_placeholder(inputs)
	return en_external_quote_reference_placeholder(inputs)
});