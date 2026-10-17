/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Send_TestInputs */

const en_send_test = /** @type {(inputs: Send_TestInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Send me a test e-mail`)
};

const fr_send_test = /** @type {(inputs: Send_TestInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`M'envoyer un e-mail de test`)
};

/**
* | output |
* | --- |
* | "Send me a test e-mail" |
*
* @param {Send_TestInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const send_test = /** @type {((inputs?: Send_TestInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Send_TestInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_send_test(inputs)
	return en_send_test(inputs)
});