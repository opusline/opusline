/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_No_Statement_TitleInputs */

const en_bank_no_statement_title = /** @type {(inputs: Bank_No_Statement_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing to reconcile yet`)
};

const fr_bank_no_statement_title = /** @type {(inputs: Bank_No_Statement_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rien à rapprocher pour l'instant`)
};

/**
* | output |
* | --- |
* | "Nothing to reconcile yet" |
*
* @param {Bank_No_Statement_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_no_statement_title = /** @type {((inputs?: Bank_No_Statement_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_No_Statement_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_no_statement_title(inputs)
	return en_bank_no_statement_title(inputs)
});