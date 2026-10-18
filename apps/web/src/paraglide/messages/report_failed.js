/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_FailedInputs */

const en_report_failed = /** @type {(inputs: Report_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The report could not be sent. Try again in a few minutes.`)
};

const fr_report_failed = /** @type {(inputs: Report_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le signalement n'a pas pu être envoyé. Réessayez dans quelques minutes.`)
};

/**
* | output |
* | --- |
* | "The report could not be sent. Try again in a few minutes." |
*
* @param {Report_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const report_failed = /** @type {((inputs?: Report_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_report_failed(inputs)
	return en_report_failed(inputs)
});