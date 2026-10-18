/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_Share_ContextInputs */

const en_report_share_context = /** @type {(inputs: Report_Share_ContextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Attach the page, browser and language`)
};

const fr_report_share_context = /** @type {(inputs: Report_Share_ContextInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Joindre la page, le navigateur et la langue`)
};

/**
* | output |
* | --- |
* | "Attach the page, browser and language" |
*
* @param {Report_Share_ContextInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const report_share_context = /** @type {((inputs?: Report_Share_ContextInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Share_ContextInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_report_share_context(inputs)
	return en_report_share_context(inputs)
});