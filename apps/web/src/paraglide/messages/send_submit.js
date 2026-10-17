/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Send_SubmitInputs */

const en_send_submit = /** @type {(inputs: Send_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Send`)
};

const fr_send_submit = /** @type {(inputs: Send_SubmitInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Envoyer`)
};

/**
* | output |
* | --- |
* | "Send" |
*
* @param {Send_SubmitInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const send_submit = /** @type {((inputs?: Send_SubmitInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Send_SubmitInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_send_submit(inputs)
	return en_send_submit(inputs)
});