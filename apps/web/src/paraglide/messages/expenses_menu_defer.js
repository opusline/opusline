/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Menu_DeferInputs */

const en_expenses_menu_defer = /** @type {(inputs: Expenses_Menu_DeferInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Defer to the next CA3`)
};

const fr_expenses_menu_defer = /** @type {(inputs: Expenses_Menu_DeferInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reporter sur la prochaine CA3`)
};

/**
* | output |
* | --- |
* | "Defer to the next CA3" |
*
* @param {Expenses_Menu_DeferInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_menu_defer = /** @type {((inputs?: Expenses_Menu_DeferInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Menu_DeferInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_menu_defer(inputs)
	return en_expenses_menu_defer(inputs)
});