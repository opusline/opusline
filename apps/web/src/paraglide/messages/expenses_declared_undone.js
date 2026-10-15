/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Declared_UndoneInputs */



/**
* | output |
* | --- |
* | "Mark removed · statuses unlocked" |
*
* @param {Expenses_Declared_UndoneInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_declared_undone = /** @type {((inputs?: Expenses_Declared_UndoneInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Declared_UndoneInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Marquage annulé · statuts déverrouillés")
	return /** @type {LocalizedString} */ ("Mark removed · statuses unlocked")
});