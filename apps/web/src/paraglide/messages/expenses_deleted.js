/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_DeletedInputs */

const en_expenses_deleted = /** @type {(inputs: Expenses_DeletedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expense deleted`)
};

const fr_expenses_deleted = /** @type {(inputs: Expenses_DeletedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dépense supprimée`)
};

/**
* | output |
* | --- |
* | "Expense deleted" |
*
* @param {Expenses_DeletedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_deleted = /** @type {((inputs?: Expenses_DeletedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_DeletedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_deleted(inputs)
	return en_expenses_deleted(inputs)
});