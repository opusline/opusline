/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Error_SendInputs */

const en_cra_error_send = /** @type {(inputs: Cra_Error_SendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The CRA could not be marked as sent.`)
};

const fr_cra_error_send = /** @type {(inputs: Cra_Error_SendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le CRA n'a pas pu être marqué envoyé.`)
};

/**
* | output |
* | --- |
* | "The CRA could not be marked as sent." |
*
* @param {Cra_Error_SendInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_error_send = /** @type {((inputs?: Cra_Error_SendInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Error_SendInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_error_send(inputs)
	return en_cra_error_send(inputs)
});