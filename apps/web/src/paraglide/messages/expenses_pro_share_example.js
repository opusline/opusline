/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Pro_Share_ExampleInputs */



/**
* | output |
* | --- |
* | "E.g. a mobile plan also used privately → 70 %." |
*
* @param {Expenses_Pro_Share_ExampleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_pro_share_example = /** @type {((inputs?: Expenses_Pro_Share_ExampleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Pro_Share_ExampleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Ex. : forfait mobile utilisé aussi à titre perso → 70 %.")
	return /** @type {LocalizedString} */ ("E.g. a mobile plan also used privately → 70 %.")
});