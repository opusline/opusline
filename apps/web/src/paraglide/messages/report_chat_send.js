/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_Chat_SendInputs */

const en_report_chat_send = /** @type {(inputs: Report_Chat_SendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Send to Claude`)
};

const fr_report_chat_send = /** @type {(inputs: Report_Chat_SendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Envoyer à Claude`)
};

/**
* | output |
* | --- |
* | "Send to Claude" |
*
* @param {Report_Chat_SendInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const report_chat_send = /** @type {((inputs?: Report_Chat_SendInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Chat_SendInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_report_chat_send(inputs)
	return en_report_chat_send(inputs)
});