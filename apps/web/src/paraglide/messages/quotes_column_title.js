/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quotes_Column_TitleInputs */

const en_quotes_column_title = /** @type {(inputs: Quotes_Column_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Title`)
};

const fr_quotes_column_title = /** @type {(inputs: Quotes_Column_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Titre`)
};

/**
* | output |
* | --- |
* | "Title" |
*
* @param {Quotes_Column_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quotes_column_title = /** @type {((inputs?: Quotes_Column_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quotes_Column_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quotes_column_title(inputs)
	return en_quotes_column_title(inputs)
});