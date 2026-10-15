/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Vat_HintInputs */

const en_invoices_vat_hint = /** @type {(inputs: Invoices_Vat_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prefilled from this client. The TTC total follows from it.`)
};

const fr_invoices_vat_hint = /** @type {(inputs: Invoices_Vat_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pré-remplie depuis ce client. Le TTC en découle.`)
};

/**
* | output |
* | --- |
* | "Prefilled from this client. The TTC total follows from it." |
*
* @param {Invoices_Vat_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_vat_hint = /** @type {((inputs?: Invoices_Vat_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Vat_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoices_vat_hint(inputs)
	return en_invoices_vat_hint(inputs)
});