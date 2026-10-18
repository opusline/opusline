/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_Context_LocaleInputs */

const en_report_context_locale = /** @type {(inputs: Report_Context_LocaleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Language`)
};

const fr_report_context_locale = /** @type {(inputs: Report_Context_LocaleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Langue`)
};

/**
* | output |
* | --- |
* | "Language" |
*
* @param {Report_Context_LocaleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const report_context_locale = /** @type {((inputs?: Report_Context_LocaleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Context_LocaleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_report_context_locale(inputs)
	return en_report_context_locale(inputs)
});