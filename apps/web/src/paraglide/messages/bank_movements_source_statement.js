/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ start: NonNullable<unknown>, end: NonNullable<unknown>, date: NonNullable<unknown> }} Bank_Movements_Source_StatementInputs */

const en_bank_movements_source_statement = /** @type {(inputs: Bank_Movements_Source_StatementInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Statement ${i?.start} to ${i?.end}, imported on ${i?.date}`)
};

const fr_bank_movements_source_statement = /** @type {(inputs: Bank_Movements_Source_StatementInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Relevé du ${i?.start} au ${i?.end}, importé le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "Statement {start} to {end}, imported on {date}" |
*
* @param {Bank_Movements_Source_StatementInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_movements_source_statement = /** @type {((inputs: Bank_Movements_Source_StatementInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Movements_Source_StatementInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_movements_source_statement(inputs)
	return en_bank_movements_source_statement(inputs)
});