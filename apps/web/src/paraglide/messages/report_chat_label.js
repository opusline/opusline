/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_Chat_LabelInputs */

const en_report_chat_label = /** @type {(inputs: Report_Chat_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Your message`)
};

const fr_report_chat_label = /** @type {(inputs: Report_Chat_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Votre message`)
};

/**
* | output |
* | --- |
* | "Your message" |
*
* @param {Report_Chat_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const report_chat_label = /** @type {((inputs?: Report_Chat_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Chat_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_report_chat_label(inputs)
	return en_report_chat_label(inputs)
});