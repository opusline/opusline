/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_SubmitInputs */

const en_report_submit = /** @type {(inputs: Report_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Send`)
};

const fr_report_submit = /** @type {(inputs: Report_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Envoyer`)
};

/**
* | output |
* | --- |
* | "Send" |
*
* @param {Report_SubmitInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const report_submit = /** @type {((inputs?: Report_SubmitInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_SubmitInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_report_submit(inputs)
	return en_report_submit(inputs)
});