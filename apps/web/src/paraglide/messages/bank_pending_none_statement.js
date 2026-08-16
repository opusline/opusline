/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Pending_None_StatementInputs */

const en_bank_pending_none_statement = /** @type {(inputs: Bank_Pending_None_StatementInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`no statement imported`)
};

const fr_bank_pending_none_statement = /** @type {(inputs: Bank_Pending_None_StatementInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`aucun relevé importé`)
};

/**
* | output |
* | --- |
* | "no statement imported" |
*
* @param {Bank_Pending_None_StatementInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_pending_none_statement = /** @type {((inputs?: Bank_Pending_None_StatementInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Pending_None_StatementInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_pending_none_statement(inputs)
	return en_bank_pending_none_statement(inputs)
});