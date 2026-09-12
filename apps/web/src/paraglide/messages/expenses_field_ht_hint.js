/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Expenses_Field_Ht_HintInputs */

const en_expenses_field_ht_hint = /** @type {(inputs: Expenses_Field_Ht_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`HT ${i?.amount}`)
};

const fr_expenses_field_ht_hint = /** @type {(inputs: Expenses_Field_Ht_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`HT ${i?.amount}`)
};

/**
* | output |
* | --- |
* | "HT {amount}" |
*
* @param {Expenses_Field_Ht_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_field_ht_hint = /** @type {((inputs: Expenses_Field_Ht_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Field_Ht_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_field_ht_hint(inputs)
	return en_expenses_field_ht_hint(inputs)
});