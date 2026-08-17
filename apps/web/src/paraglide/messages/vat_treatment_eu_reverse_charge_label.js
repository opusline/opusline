/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Vat_Treatment_Eu_Reverse_Charge_LabelInputs */

const en_vat_treatment_eu_reverse_charge_label = /** @type {(inputs: Vat_Treatment_Eu_Reverse_Charge_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`EU reverse charge`)
};

const fr_vat_treatment_eu_reverse_charge_label = /** @type {(inputs: Vat_Treatment_Eu_Reverse_Charge_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Autoliquidation UE`)
};

/**
* | output |
* | --- |
* | "EU reverse charge" |
*
* @param {Vat_Treatment_Eu_Reverse_Charge_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const vat_treatment_eu_reverse_charge_label = /** @type {((inputs?: Vat_Treatment_Eu_Reverse_Charge_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Vat_Treatment_Eu_Reverse_Charge_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_vat_treatment_eu_reverse_charge_label(inputs)
	return en_vat_treatment_eu_reverse_charge_label(inputs)
});