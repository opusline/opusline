/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ date: NonNullable<unknown> }} Invoicing_Legal_Ecb_RateInputs */

const en_invoicing_legal_ecb_rate = /** @type {(inputs: Invoicing_Legal_Ecb_RateInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`ECB rate on ${i?.date}`)
};

const fr_invoicing_legal_ecb_rate = /** @type {(inputs: Invoicing_Legal_Ecb_RateInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Taux BCE au ${i?.date}`)
};

/**
* | output |
* | --- |
* | "ECB rate on {date}" |
*
* @param {Invoicing_Legal_Ecb_RateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_legal_ecb_rate = /** @type {((inputs: Invoicing_Legal_Ecb_RateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Legal_Ecb_RateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_legal_ecb_rate(inputs)
	return en_invoicing_legal_ecb_rate(inputs)
});