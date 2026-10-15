/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Menu_DuplicateInputs */

const en_expenses_menu_duplicate = /** @type {(inputs: Expenses_Menu_DuplicateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Duplicate`)
};

const fr_expenses_menu_duplicate = /** @type {(inputs: Expenses_Menu_DuplicateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dupliquer`)
};

/**
* | output |
* | --- |
* | "Duplicate" |
*
* @param {Expenses_Menu_DuplicateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_menu_duplicate = /** @type {((inputs?: Expenses_Menu_DuplicateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Menu_DuplicateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_menu_duplicate(inputs)
	return en_expenses_menu_duplicate(inputs)
});