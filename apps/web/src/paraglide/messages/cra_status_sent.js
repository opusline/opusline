/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Status_SentInputs */

const en_cra_status_sent = /** @type {(inputs: Cra_Status_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sent`)
};

const fr_cra_status_sent = /** @type {(inputs: Cra_Status_SentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Envoyé`)
};

/**
* | output |
* | --- |
* | "Sent" |
*
* @param {Cra_Status_SentInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_status_sent = /** @type {((inputs?: Cra_Status_SentInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Status_SentInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_status_sent(inputs)
	return en_cra_status_sent(inputs)
});