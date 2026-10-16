/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Legal_EinvoicingInputs */

const en_invoicing_legal_einvoicing = /** @type {(inputs: Invoicing_Legal_EinvoicingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`E-invoicing`)
};

const fr_invoicing_legal_einvoicing = /** @type {(inputs: Invoicing_Legal_EinvoicingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facture électronique`)
};

/**
* | output |
* | --- |
* | "E-invoicing" |
*
* @param {Invoicing_Legal_EinvoicingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_legal_einvoicing = /** @type {((inputs?: Invoicing_Legal_EinvoicingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Legal_EinvoicingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_legal_einvoicing(inputs)
	return en_invoicing_legal_einvoicing(inputs)
});