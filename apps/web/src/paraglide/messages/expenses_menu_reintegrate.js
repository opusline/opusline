/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Menu_ReintegrateInputs */



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
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Réintégrer dans la CA3")
	return /** @type {LocalizedString} */ ("Put back on the CA3")
});