/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Menu_DeleteInputs */

const en_expenses_menu_delete = /** @type {(inputs: Expenses_Menu_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete`)
};

const fr_expenses_menu_delete = /** @type {(inputs: Expenses_Menu_DeleteInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supprimer`)
};

/**
* | output |
* | --- |
* | "Delete" |
*
* @param {Expenses_Menu_DeleteInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_menu_delete = /** @type {((inputs?: Expenses_Menu_DeleteInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Menu_DeleteInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_menu_delete(inputs)
	return en_expenses_menu_delete(inputs)
});