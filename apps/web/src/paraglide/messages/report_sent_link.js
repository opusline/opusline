/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_Sent_LinkInputs */

const en_report_sent_link = /** @type {(inputs: Report_Sent_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Follow it on GitHub`)
};

const fr_report_sent_link = /** @type {(inputs: Report_Sent_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le suivre sur GitHub`)
};

/**
* | output |
* | --- |
* | "Follow it on GitHub" |
*
* @param {Report_Sent_LinkInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const report_sent_link = /** @type {((inputs?: Report_Sent_LinkInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Sent_LinkInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_report_sent_link(inputs)
	return en_report_sent_link(inputs)
});