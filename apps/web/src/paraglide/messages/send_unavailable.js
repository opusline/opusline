/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Send_UnavailableInputs */

const en_send_unavailable = /** @type {(inputs: Send_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This instance sends no e-mail: set MAIL_* to send documents from Opusline.`)
};

const fr_send_unavailable = /** @type {(inputs: Send_UnavailableInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cette instance n'envoie pas d'e-mail : renseignez MAIL_* pour envoyer vos documents depuis Opusline.`)
};

/**
* | output |
* | --- |
* | "This instance sends no e-mail: set MAIL_* to send documents from Opusline." |
*
* @param {Send_UnavailableInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const send_unavailable = /** @type {((inputs?: Send_UnavailableInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Send_UnavailableInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_send_unavailable(inputs)
	return en_send_unavailable(inputs)
});