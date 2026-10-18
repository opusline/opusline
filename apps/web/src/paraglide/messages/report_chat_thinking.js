/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_Chat_ThinkingInputs */

const en_report_chat_thinking = /** @type {(inputs: Report_Chat_ThinkingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Claude is writing…`)
};

const fr_report_chat_thinking = /** @type {(inputs: Report_Chat_ThinkingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Claude écrit…`)
};

/**
* | output |
* | --- |
* | "Claude is writing…" |
*
* @param {Report_Chat_ThinkingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const report_chat_thinking = /** @type {((inputs?: Report_Chat_ThinkingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Chat_ThinkingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_report_chat_thinking(inputs)
	return en_report_chat_thinking(inputs)
});