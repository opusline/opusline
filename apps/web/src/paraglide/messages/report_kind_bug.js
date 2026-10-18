/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_Kind_BugInputs */

const en_report_kind_bug = /** @type {(inputs: Report_Kind_BugInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bug`)
};

const fr_report_kind_bug = /** @type {(inputs: Report_Kind_BugInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Bug`)
};

/**
* | output |
* | --- |
* | "Bug" |
*
* @param {Report_Kind_BugInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const report_kind_bug = /** @type {((inputs?: Report_Kind_BugInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Kind_BugInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_report_kind_bug(inputs)
	return en_report_kind_bug(inputs)
});