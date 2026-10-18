/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_Context_BrowserInputs */

const en_report_context_browser = /** @type {(inputs: Report_Context_BrowserInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Browser`)
};

const fr_report_context_browser = /** @type {(inputs: Report_Context_BrowserInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Navigateur`)
};

/**
* | output |
* | --- |
* | "Browser" |
*
* @param {Report_Context_BrowserInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const report_context_browser = /** @type {((inputs?: Report_Context_BrowserInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Context_BrowserInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_report_context_browser(inputs)
	return en_report_context_browser(inputs)
});