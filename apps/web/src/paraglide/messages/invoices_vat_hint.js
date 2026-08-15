/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Vat_HintInputs */

const en_invoices_vat_hint = /** @type {(inputs: Invoices_Vat_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`VAT and the TTC total are computed from your settings.`)
};

const fr_invoices_vat_hint = /** @type {(inputs: Invoices_Vat_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La TVA et le TTC sont calculés depuis vos paramètres.`)
};

/**
* | output |
* | --- |
* | "VAT and the TTC total are computed from your settings." |
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