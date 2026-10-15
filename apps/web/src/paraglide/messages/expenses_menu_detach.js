/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Menu_DetachInputs */

const en_expenses_menu_detach = /** @type {(inputs: Expenses_Menu_DetachInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Detach the receipt`)
};

const fr_expenses_menu_detach = /** @type {(inputs: Expenses_Menu_DetachInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Détacher la facture`)
};

/**
* | output |
* | --- |
* | "Detach the receipt" |
*
* @param {Expenses_Menu_DetachInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_menu_detach = /** @type {((inputs?: Expenses_Menu_DetachInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Menu_DetachInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_menu_detach(inputs)
	return en_expenses_menu_detach(inputs)
});