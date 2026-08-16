/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Bank_Balance_From_StatementInputs */

const en_bank_balance_from_statement = /** @type {(inputs: Bank_Balance_From_StatementInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`statement of ${i?.date}`)
};

const fr_bank_balance_from_statement = /** @type {(inputs: Bank_Balance_From_StatementInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`relevé du ${i?.date}`)
};

/**
* | output |
* | --- |
* | "statement of {date}" |
*
* @param {Bank_Balance_From_StatementInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_balance_from_statement = /** @type {((inputs: Bank_Balance_From_StatementInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Balance_From_StatementInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_balance_from_statement(inputs)
	return en_bank_balance_from_statement(inputs)
});