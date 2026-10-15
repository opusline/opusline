/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Deadlines_Income_Tax_Return_SubInputs */



/**
* | output |
* | --- |
* | "Estimated date — the fisc publishes the exact day each April" |
*
* @param {Deadlines_Income_Tax_Return_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_income_tax_return_sub = /** @type {((inputs?: Deadlines_Income_Tax_Return_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Income_Tax_Return_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Date estimée — le fisc publie le jour exact chaque avril")
	return /** @type {LocalizedString} */ ("Estimated date — the fisc publishes the exact day each April")
});