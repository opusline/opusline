/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Legal_Einvoicing_ValueInputs */

const en_invoicing_legal_einvoicing_value = /** @type {(inputs: Invoicing_Legal_Einvoicing_ValueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`receiving from 01/09/2026, issuing from 01/09/2027`)
};

const fr_invoicing_legal_einvoicing_value = /** @type {(inputs: Invoicing_Legal_Einvoicing_ValueInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`réception dès le 01/09/2026, émission au 01/09/2027`)
};

/**
* | output |
* | --- |
* | "receiving from 01/09/2026, issuing from 01/09/2027" |
*
* @param {Invoicing_Legal_Einvoicing_ValueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_legal_einvoicing_value = /** @type {((inputs?: Invoicing_Legal_Einvoicing_ValueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Legal_Einvoicing_ValueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_legal_einvoicing_value(inputs)
	return en_invoicing_legal_einvoicing_value(inputs)
});