/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ start: NonNullable<unknown>, end: NonNullable<unknown>, validated: NonNullable<unknown>, total: NonNullable<unknown> }} Bank_Statement_NoteInputs */

const en_bank_statement_note = /** @type {(inputs: Bank_Statement_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Statement ${i?.start} to ${i?.end} · ${i?.validated} of ${i?.total} validated`)
};

const fr_bank_statement_note = /** @type {(inputs: Bank_Statement_NoteInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Relevé du ${i?.start} au ${i?.end} · ${i?.validated} sur ${i?.total} validées`)
};

/**
* | output |
* | --- |
* | "Statement {start} to {end} · {validated} of {total} validated" |
*
* @param {Bank_Statement_NoteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_statement_note = /** @type {((inputs: Bank_Statement_NoteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Statement_NoteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_statement_note(inputs)
	return en_bank_statement_note(inputs)
});