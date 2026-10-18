/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_Chat_SkipInputs */

const en_report_chat_skip = /** @type {(inputs: Report_Chat_SkipInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fill in the form myself`)
};

const fr_report_chat_skip = /** @type {(inputs: Report_Chat_SkipInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remplir le formulaire moi-même`)
};

/**
* | output |
* | --- |
* | "Fill in the form myself" |
*
* @param {Report_Chat_SkipInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const report_chat_skip = /** @type {((inputs?: Report_Chat_SkipInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Chat_SkipInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_report_chat_skip(inputs)
	return en_report_chat_skip(inputs)
});