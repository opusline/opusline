/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Menu_ReintegrateInputs */

const en_expenses_menu_reintegrate = /** @type {(inputs: Expenses_Menu_ReintegrateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Put back on the CA3`)
};

const fr_expenses_menu_reintegrate = /** @type {(inputs: Expenses_Menu_ReintegrateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Réintégrer dans la CA3`)
};

/**
* | output |
* | --- |
* | "Put back on the CA3" |
*
* @param {Expenses_Menu_ReintegrateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_menu_reintegrate = /** @type {((inputs?: Expenses_Menu_ReintegrateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Menu_ReintegrateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_menu_reintegrate(inputs)
	return en_expenses_menu_reintegrate(inputs)
});