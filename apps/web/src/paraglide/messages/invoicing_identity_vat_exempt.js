/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Identity_Vat_ExemptInputs */

const en_invoicing_identity_vat_exempt = /** @type {(inputs: Invoicing_Identity_Vat_ExemptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`not liable · franchise en base`)
};

const fr_invoicing_identity_vat_exempt = /** @type {(inputs: Invoicing_Identity_Vat_ExemptInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`non assujetti · franchise en base`)
};

/**
* | output |
* | --- |
* | "not liable · franchise en base" |
*
* @param {Invoicing_Identity_Vat_ExemptInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_identity_vat_exempt = /** @type {((inputs?: Invoicing_Identity_Vat_ExemptInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Identity_Vat_ExemptInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_identity_vat_exempt(inputs)
	return en_invoicing_identity_vat_exempt(inputs)
});