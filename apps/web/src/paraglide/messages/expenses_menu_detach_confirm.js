/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Menu_Detach_ConfirmInputs */

const en_expenses_menu_detach_confirm = /** @type {(inputs: Expenses_Menu_Detach_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirm the detachment?`)
};

const fr_expenses_menu_detach_confirm = /** @type {(inputs: Expenses_Menu_Detach_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Confirmer le détachement ?`)
};

/**
* | output |
* | --- |
* | "Confirm the detachment?" |
*
* @param {Expenses_Menu_Detach_ConfirmInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_menu_detach_confirm = /** @type {((inputs?: Expenses_Menu_Detach_ConfirmInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Menu_Detach_ConfirmInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_menu_detach_confirm(inputs)
	return en_expenses_menu_detach_confirm(inputs)
});