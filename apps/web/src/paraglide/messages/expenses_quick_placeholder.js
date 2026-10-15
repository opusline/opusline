/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Quick_PlaceholderInputs */



/**
* | output |
* | --- |
* | "lunaprint 429 monitor 20%" |
*
* @param {Expenses_Quick_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_quick_placeholder = /** @type {((inputs?: Expenses_Quick_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Quick_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("lunaprint 429 écran 20%")
	return /** @type {LocalizedString} */ ("lunaprint 429 monitor 20%")
});