/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Vat_Treatment_Eu_Reverse_Charge_HintInputs */

const en_vat_treatment_eu_reverse_charge_hint = /** @type {(inputs: Vat_Treatment_Eu_Reverse_Charge_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Business in the EU with a VAT number: they account for the VAT.`)
};

const fr_vat_treatment_eu_reverse_charge_hint = /** @type {(inputs: Vat_Treatment_Eu_Reverse_Charge_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Entreprise dans l'UE avec numéro de TVA : c'est elle qui la déclare.`)
};

/**
* | output |
* | --- |
* | "Business in the EU with a VAT number: they account for the VAT." |
*
* @param {Vat_Treatment_Eu_Reverse_Charge_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const vat_treatment_eu_reverse_charge_hint = /** @type {((inputs?: Vat_Treatment_Eu_Reverse_Charge_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Vat_Treatment_Eu_Reverse_Charge_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_vat_treatment_eu_reverse_charge_hint(inputs)
	return en_vat_treatment_eu_reverse_charge_hint(inputs)
});