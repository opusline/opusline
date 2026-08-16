/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Badge_No_StatementInputs */

const en_bank_badge_no_statement = /** @type {(inputs: Bank_Badge_No_StatementInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No statement`)
};

const fr_bank_badge_no_statement = /** @type {(inputs: Bank_Badge_No_StatementInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucun relevé`)
};

/**
* | output |
* | --- |
* | "No statement" |
*
* @param {Bank_Badge_No_StatementInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_badge_no_statement = /** @type {((inputs?: Bank_Badge_No_StatementInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Badge_No_StatementInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_badge_no_statement(inputs)
	return en_bank_badge_no_statement(inputs)
});