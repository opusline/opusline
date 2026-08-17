/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Vat_Treatment_Outside_Eu_HintInputs */

const en_vat_treatment_outside_eu_hint = /** @type {(inputs: Vat_Treatment_Outside_Eu_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Outside the scope of French VAT.`)
};

const fr_vat_treatment_outside_eu_hint = /** @type {(inputs: Vat_Treatment_Outside_Eu_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Prestation hors du champ de la TVA française.`)
};

/**
* | output |
* | --- |
* | "Outside the scope of French VAT." |
*
* @param {Vat_Treatment_Outside_Eu_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const vat_treatment_outside_eu_hint = /** @type {((inputs?: Vat_Treatment_Outside_Eu_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Vat_Treatment_Outside_Eu_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_vat_treatment_outside_eu_hint(inputs)
	return en_vat_treatment_outside_eu_hint(inputs)
});