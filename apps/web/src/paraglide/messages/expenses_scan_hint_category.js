/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Scan_Hint_CategoryInputs */



/**
* | output |
* | --- |
* | "Check the category and the pro share, then save. Every field stays editable." |
*
* @param {Expenses_Scan_Hint_CategoryInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_scan_hint_category = /** @type {((inputs?: Expenses_Scan_Hint_CategoryInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Scan_Hint_CategoryInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Vérifiez la catégorie et la quote-part pro, puis enregistrez. Les champs restent modifiables.")
	return /** @type {LocalizedString} */ ("Check the category and the pro share, then save. Every field stays editable.")
});