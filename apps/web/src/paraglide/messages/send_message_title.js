/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Send_Message_TitleInputs */

const en_send_message_title = /** @type {(inputs: Send_Message_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Message`)
};

const fr_send_message_title = /** @type {(inputs: Send_Message_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Message`)
};

/**
* | output |
* | --- |
* | "Message" |
*
* @param {Send_Message_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const send_message_title = /** @type {((inputs?: Send_Message_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Send_Message_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_send_message_title(inputs)
	return en_send_message_title(inputs)
});