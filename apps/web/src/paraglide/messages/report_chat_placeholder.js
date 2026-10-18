/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Report_Chat_PlaceholderInputs */

const en_report_chat_placeholder = /** @type {(inputs: Report_Chat_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Describe the bug or the idea…`)
};

const fr_report_chat_placeholder = /** @type {(inputs: Report_Chat_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Décrivez le bug ou l'idée…`)
};

/**
* | output |
* | --- |
* | "Describe the bug or the idea…" |
*
* @param {Report_Chat_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const report_chat_placeholder = /** @type {((inputs?: Report_Chat_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Report_Chat_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_report_chat_placeholder(inputs)
	return en_report_chat_placeholder(inputs)
});