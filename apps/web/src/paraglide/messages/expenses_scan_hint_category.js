/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Scan_Hint_CategoryInputs */

const en_expenses_scan_hint_category = /** @type {(inputs: Expenses_Scan_Hint_CategoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Check the category and the pro share, then save. Every field stays editable.`)
};

const fr_expenses_scan_hint_category = /** @type {(inputs: Expenses_Scan_Hint_CategoryInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vérifiez la catégorie et la quote-part pro, puis enregistrez. Les champs restent modifiables.`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_scan_hint_category(inputs)
	return en_expenses_scan_hint_category(inputs)
});