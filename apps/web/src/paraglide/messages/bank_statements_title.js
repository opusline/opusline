/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Statements_TitleInputs */

const en_bank_statements_title = /** @type {(inputs: Bank_Statements_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Imported statements`)
};

const fr_bank_statements_title = /** @type {(inputs: Bank_Statements_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Relevés importés`)
};

/**
* | output |
* | --- |
* | "Imported statements" |
*
* @param {Bank_Statements_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_statements_title = /** @type {((inputs?: Bank_Statements_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Statements_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_statements_title(inputs)
	return en_bank_statements_title(inputs)
});