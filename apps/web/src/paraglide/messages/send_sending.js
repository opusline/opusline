/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Send_SendingInputs */

const en_send_sending = /** @type {(inputs: Send_SendingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sending…`)
};

const fr_send_sending = /** @type {(inputs: Send_SendingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Envoi…`)
};

/**
* | output |
* | --- |
* | "Sending…" |
*
* @param {Send_SendingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const send_sending = /** @type {((inputs?: Send_SendingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Send_SendingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_send_sending(inputs)
	return en_send_sending(inputs)
});