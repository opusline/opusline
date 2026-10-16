/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_Source_ExternalInputs */

const en_quote_source_external = /** @type {(inputs: Quote_Source_ExternalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Issued elsewhere`)
};

const fr_quote_source_external = /** @type {(inputs: Quote_Source_ExternalInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Émis ailleurs`)
};

/**
* | output |
* | --- |
* | "Issued elsewhere" |
*
* @param {Quote_Source_ExternalInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_source_external = /** @type {((inputs?: Quote_Source_ExternalInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Source_ExternalInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_source_external(inputs)
	return en_quote_source_external(inputs)
});