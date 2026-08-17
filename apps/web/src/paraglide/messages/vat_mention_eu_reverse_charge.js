/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Vat_Mention_Eu_Reverse_ChargeInputs */

const en_vat_mention_eu_reverse_charge = /** @type {(inputs: Vat_Mention_Eu_Reverse_ChargeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Autoliquidation de la TVA par le preneur — art. 283-2 du CGI`)
};

const fr_vat_mention_eu_reverse_charge = /** @type {(inputs: Vat_Mention_Eu_Reverse_ChargeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Autoliquidation de la TVA par le preneur — art. 283-2 du CGI`)
};

/**
* | output |
* | --- |
* | "Autoliquidation de la TVA par le preneur — art. 283-2 du CGI" |
*
* @param {Vat_Mention_Eu_Reverse_ChargeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const vat_mention_eu_reverse_charge = /** @type {((inputs?: Vat_Mention_Eu_Reverse_ChargeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Vat_Mention_Eu_Reverse_ChargeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_vat_mention_eu_reverse_charge(inputs)
	return en_vat_mention_eu_reverse_charge(inputs)
});