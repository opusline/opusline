/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ month: NonNullable<unknown> }} Expenses_Updated_RegularisedInputs */

const en_expenses_updated_regularised = /** @type {(inputs: Expenses_Updated_RegularisedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Expense updated after filing → box 21, CA3 ${i?.month}`)
};

const fr_expenses_updated_regularised = /** @type {(inputs: Expenses_Updated_RegularisedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Dépense modifiée après déclaration → case 21, CA3 ${i?.month}`)
};

/**
* | output |
* | --- |
* | "Expense updated after filing → box 21, CA3 {month}" |
*
* @param {Expenses_Updated_RegularisedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_updated_regularised = /** @type {((inputs: Expenses_Updated_RegularisedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Updated_RegularisedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_updated_regularised(inputs)
	return en_expenses_updated_regularised(inputs)
});