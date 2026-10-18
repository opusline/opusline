/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ number: NonNullable<unknown> }} Report_SentInputs */

const en_report_sent = /** @type {(inputs: Report_SentInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Thanks! Your report is issue #${i?.number}.`)
};

const fr_report_sent = /** @type {(inputs: Report_SentInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Merci ! Votre signalement est le ticket n° ${i?.number}.`)
};

/**
* | output |
* | --- |
* | "Thanks! Your report is issue #{number}." |
*
* @param {Report_SentInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const report_sent = /** @type {((inputs: Report_SentInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_SentInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_report_sent(inputs)
	return en_report_sent(inputs)
});