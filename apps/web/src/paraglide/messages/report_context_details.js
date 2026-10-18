/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_Context_DetailsInputs */

const en_report_context_details = /** @type {(inputs: Report_Context_DetailsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What is attached`)
};

const fr_report_context_details = /** @type {(inputs: Report_Context_DetailsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ce qui est joint`)
};

/**
* | output |
* | --- |
* | "What is attached" |
*
* @param {Report_Context_DetailsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const report_context_details = /** @type {((inputs?: Report_Context_DetailsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Context_DetailsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_report_context_details(inputs)
	return en_report_context_details(inputs)
});