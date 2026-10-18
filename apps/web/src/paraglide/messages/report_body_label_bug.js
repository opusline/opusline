/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_Body_Label_BugInputs */

const en_report_body_label_bug = /** @type {(inputs: Report_Body_Label_BugInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`What happened?`)
};

const fr_report_body_label_bug = /** @type {(inputs: Report_Body_Label_BugInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Que s'est-il passé ?`)
};

/**
* | output |
* | --- |
* | "What happened?" |
*
* @param {Report_Body_Label_BugInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const report_body_label_bug = /** @type {((inputs?: Report_Body_Label_BugInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Body_Label_BugInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_report_body_label_bug(inputs)
	return en_report_body_label_bug(inputs)
});