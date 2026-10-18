/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_Duplicates_HeadingInputs */

const en_report_duplicates_heading = /** @type {(inputs: Report_Duplicates_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Maybe already reported`)
};

const fr_report_duplicates_heading = /** @type {(inputs: Report_Duplicates_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Peut-être déjà signalé`)
};

/**
* | output |
* | --- |
* | "Maybe already reported" |
*
* @param {Report_Duplicates_HeadingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const report_duplicates_heading = /** @type {((inputs?: Report_Duplicates_HeadingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Duplicates_HeadingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_report_duplicates_heading(inputs)
	return en_report_duplicates_heading(inputs)
});