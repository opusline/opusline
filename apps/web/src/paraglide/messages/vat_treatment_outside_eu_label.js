/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Vat_Treatment_Outside_Eu_LabelInputs */

const en_vat_treatment_outside_eu_label = /** @type {(inputs: Vat_Treatment_Outside_Eu_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Outside the EU`)
};

const fr_vat_treatment_outside_eu_label = /** @type {(inputs: Vat_Treatment_Outside_Eu_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Hors UE`)
};

/**
* | output |
* | --- |
* | "Outside the EU" |
*
* @param {Vat_Treatment_Outside_Eu_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const vat_treatment_outside_eu_label = /** @type {((inputs?: Vat_Treatment_Outside_Eu_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Vat_Treatment_Outside_Eu_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_vat_treatment_outside_eu_label(inputs)
	return en_vat_treatment_outside_eu_label(inputs)
});