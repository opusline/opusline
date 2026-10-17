/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Send_Recipients_TitleInputs */

const en_send_recipients_title = /** @type {(inputs: Send_Recipients_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Recipients`)
};

const fr_send_recipients_title = /** @type {(inputs: Send_Recipients_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Destinataires`)
};

/**
* | output |
* | --- |
* | "Recipients" |
*
* @param {Send_Recipients_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const send_recipients_title = /** @type {((inputs?: Send_Recipients_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Send_Recipients_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_send_recipients_title(inputs)
	return en_send_recipients_title(inputs)
});