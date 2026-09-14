/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_AddInputs */

const en_expenses_add = /** @type {(inputs: Expenses_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add an expense`)
};

const fr_expenses_add = /** @type {(inputs: Expenses_AddInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter une dépense`)
};

/**
* | output |
* | --- |
* | "Add an expense" |
*
* @param {Expenses_AddInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_add = /** @type {((inputs?: Expenses_AddInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_AddInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_add(inputs)
	return en_expenses_add(inputs)
});