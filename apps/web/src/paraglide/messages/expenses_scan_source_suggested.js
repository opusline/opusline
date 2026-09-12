/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Scan_Source_SuggestedInputs */

const en_expenses_scan_source_suggested = /** @type {(inputs: Expenses_Scan_Source_SuggestedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`· suggested, check it`)
};

const fr_expenses_scan_source_suggested = /** @type {(inputs: Expenses_Scan_Source_SuggestedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`· suggérée, à vérifier`)
};

/**
* | output |
* | --- |
* | "· suggested, check it" |
*
* @param {Expenses_Scan_Source_SuggestedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_scan_source_suggested = /** @type {((inputs?: Expenses_Scan_Source_SuggestedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Scan_Source_SuggestedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_scan_source_suggested(inputs)
	return en_expenses_scan_source_suggested(inputs)
});