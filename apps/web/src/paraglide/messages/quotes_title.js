/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quotes_TitleInputs */

const en_quotes_title = /** @type {(inputs: Quotes_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Quotes`)
};

const fr_quotes_title = /** @type {(inputs: Quotes_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Devis`)
};

/**
* | output |
* | --- |
* | "Quotes" |
*
* @param {Quotes_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quotes_title = /** @type {((inputs?: Quotes_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quotes_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quotes_title(inputs)
	return en_quotes_title(inputs)
});