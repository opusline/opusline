/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Send_FailedInputs */

const en_send_failed = /** @type {(inputs: Send_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The e-mail could not be sent.`)
};

const fr_send_failed = /** @type {(inputs: Send_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`L'e-mail n'a pas pu être envoyé.`)
};

/**
* | output |
* | --- |
* | "The e-mail could not be sent." |
*
* @param {Send_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const send_failed = /** @type {((inputs?: Send_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Send_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_send_failed(inputs)
	return en_send_failed(inputs)
});