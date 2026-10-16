/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quotes_Column_NumberInputs */

const en_quotes_column_number = /** @type {(inputs: Quotes_Column_NumberInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quote number`)
};

const fr_quotes_column_number = /** @type {(inputs: Quotes_Column_NumberInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Numéro du devis`)
};

/**
* | output |
* | --- |
* | "Quote number" |
*
* @param {Quotes_Column_NumberInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quotes_column_number = /** @type {((inputs?: Quotes_Column_NumberInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quotes_Column_NumberInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quotes_column_number(inputs)
	return en_quotes_column_number(inputs)
});