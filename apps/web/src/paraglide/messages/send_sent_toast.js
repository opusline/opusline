/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ recipients: NonNullable<unknown> }} Send_Sent_ToastInputs */

const en_send_sent_toast = /** @type {(inputs: Send_Sent_ToastInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Sent to ${i?.recipients}`)
};

const fr_send_sent_toast = /** @type {(inputs: Send_Sent_ToastInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Envoyé à ${i?.recipients}`)
};

/**
* | output |
* | --- |
* | "Sent to {recipients}" |
*
* @param {Send_Sent_ToastInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const send_sent_toast = /** @type {((inputs: Send_Sent_ToastInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Send_Sent_ToastInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_send_sent_toast(inputs)
	return en_send_sent_toast(inputs)
});