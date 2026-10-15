/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Statement_Note_NoneInputs */

const en_bank_statement_note_none = /** @type {(inputs: Bank_Statement_Note_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No statement imported`)
};

const fr_bank_statement_note_none = /** @type {(inputs: Bank_Statement_Note_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucun relevé importé`)
};

/**
* | output |
* | --- |
* | "No statement imported" |
*
* @param {Bank_Statement_Note_NoneInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_statement_note_none = /** @type {((inputs?: Bank_Statement_Note_NoneInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Statement_Note_NoneInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_statement_note_none(inputs)
	return en_bank_statement_note_none(inputs)
});