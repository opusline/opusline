/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Menu_EditInputs */

const en_expenses_menu_edit = /** @type {(inputs: Expenses_Menu_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Edit`)
};

const fr_expenses_menu_edit = /** @type {(inputs: Expenses_Menu_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modifier`)
};

/**
* | output |
* | --- |
* | "Edit" |
*
* @param {Expenses_Menu_EditInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_menu_edit = /** @type {((inputs?: Expenses_Menu_EditInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Menu_EditInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_menu_edit(inputs)
	return en_expenses_menu_edit(inputs)
});