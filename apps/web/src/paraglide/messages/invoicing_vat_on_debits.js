/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Vat_On_DebitsInputs */

const en_invoicing_vat_on_debits = /** @type {(inputs: Invoicing_Vat_On_DebitsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`I opted to pay VAT on debits`)
};

const fr_invoicing_vat_on_debits = /** @type {(inputs: Invoicing_Vat_On_DebitsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`J'ai opté pour le paiement de la TVA d'après les débits`)
};

/**
* | output |
* | --- |
* | "I opted to pay VAT on debits" |
*
* @param {Invoicing_Vat_On_DebitsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_vat_on_debits = /** @type {((inputs?: Invoicing_Vat_On_DebitsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Vat_On_DebitsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_vat_on_debits(inputs)
	return en_invoicing_vat_on_debits(inputs)
});