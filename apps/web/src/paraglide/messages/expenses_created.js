/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_CreatedInputs */

const en_expenses_created = /** @type {(inputs: Expenses_CreatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expense added`)
};

const fr_expenses_created = /** @type {(inputs: Expenses_CreatedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dépense ajoutée`)
};

/**
* | output |
* | --- |
* | "Expense added" |
*
* @param {Expenses_CreatedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_created = /** @type {((inputs?: Expenses_CreatedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_CreatedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_created(inputs)
	return en_expenses_created(inputs)
});