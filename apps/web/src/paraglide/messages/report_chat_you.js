/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_Chat_YouInputs */

const en_report_chat_you = /** @type {(inputs: Report_Chat_YouInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`You`)
};

const fr_report_chat_you = /** @type {(inputs: Report_Chat_YouInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Vous`)
};

/**
* | output |
* | --- |
* | "You" |
*
* @param {Report_Chat_YouInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const report_chat_you = /** @type {((inputs?: Report_Chat_YouInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Chat_YouInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_report_chat_you(inputs)
	return en_report_chat_you(inputs)
});