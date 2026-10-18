/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_HeadingInputs */

const en_report_heading = /** @type {(inputs: Report_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Report a bug or an idea`)
};

const fr_report_heading = /** @type {(inputs: Report_HeadingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Signaler un bug ou une idée`)
};

/**
* | output |
* | --- |
* | "Report a bug or an idea" |
*
* @param {Report_HeadingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const report_heading = /** @type {((inputs?: Report_HeadingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_HeadingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_report_heading(inputs)
	return en_report_heading(inputs)
});