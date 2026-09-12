/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ month: NonNullable<unknown> }} Expenses_Created_RegularisedInputs */

const en_expenses_created_regularised = /** @type {(inputs: Expenses_Created_RegularisedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Expense added after filing → box 21, CA3 ${i?.month}`)
};

const fr_expenses_created_regularised = /** @type {(inputs: Expenses_Created_RegularisedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Dépense ajoutée après déclaration → case 21, CA3 ${i?.month}`)
};

/**
* | output |
* | --- |
* | "Expense added after filing → box 21, CA3 {month}" |
*
* @param {Expenses_Created_RegularisedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_created_regularised = /** @type {((inputs: Expenses_Created_RegularisedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Created_RegularisedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_created_regularised(inputs)
	return en_expenses_created_regularised(inputs)
});