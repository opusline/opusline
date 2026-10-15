/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_UpdatedInputs */

const en_expenses_updated = /** @type {(inputs: Expenses_UpdatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expense updated`)
};

const fr_expenses_updated = /** @type {(inputs: Expenses_UpdatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dépense modifiée`)
};

/**
* | output |
* | --- |
* | "Expense updated" |
*
* @param {Expenses_UpdatedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_updated = /** @type {((inputs?: Expenses_UpdatedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_UpdatedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_updated(inputs)
	return en_expenses_updated(inputs)
});