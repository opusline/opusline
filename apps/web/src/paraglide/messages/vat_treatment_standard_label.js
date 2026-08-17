/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Vat_Treatment_Standard_LabelInputs */

const en_vat_treatment_standard_label = /** @type {(inputs: Vat_Treatment_Standard_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`My usual VAT`)
};

const fr_vat_treatment_standard_label = /** @type {(inputs: Vat_Treatment_Standard_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ma TVA habituelle`)
};

/**
* | output |
* | --- |
* | "My usual VAT" |
*
* @param {Vat_Treatment_Standard_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const vat_treatment_standard_label = /** @type {((inputs?: Vat_Treatment_Standard_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Vat_Treatment_Standard_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_vat_treatment_standard_label(inputs)
	return en_vat_treatment_standard_label(inputs)
});