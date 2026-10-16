/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Einvoice_Status_IssuedInputs */

const en_einvoice_status_issued = /** @type {(inputs: Einvoice_Status_IssuedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Issued`)
};

const fr_einvoice_status_issued = /** @type {(inputs: Einvoice_Status_IssuedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Émise`)
};

/**
* | output |
* | --- |
* | "Issued" |
*
* @param {Einvoice_Status_IssuedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const einvoice_status_issued = /** @type {((inputs?: Einvoice_Status_IssuedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Einvoice_Status_IssuedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_einvoice_status_issued(inputs)
	return en_einvoice_status_issued(inputs)
});