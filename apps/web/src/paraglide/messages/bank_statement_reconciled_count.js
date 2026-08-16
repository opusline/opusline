/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ validated: NonNullable<unknown>, total: NonNullable<unknown> }} Bank_Statement_Reconciled_CountInputs */

const en_bank_statement_reconciled_count = /** @type {(inputs: Bank_Statement_Reconciled_CountInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.validated} / ${i?.total} reconciled`)
};

const fr_bank_statement_reconciled_count = /** @type {(inputs: Bank_Statement_Reconciled_CountInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.validated} / ${i?.total} rapprochées`)
};

/**
* | output |
* | --- |
* | "{validated} / {total} reconciled" |
*
* @param {Bank_Statement_Reconciled_CountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_statement_reconciled_count = /** @type {((inputs: Bank_Statement_Reconciled_CountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Statement_Reconciled_CountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_statement_reconciled_count(inputs)
	return en_bank_statement_reconciled_count(inputs)
});