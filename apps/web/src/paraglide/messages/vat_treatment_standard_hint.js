/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Vat_Treatment_Standard_HintInputs */

const en_vat_treatment_standard_hint = /** @type {(inputs: Vat_Treatment_Standard_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The rate from my settings applies.`)
};

const fr_vat_treatment_standard_hint = /** @type {(inputs: Vat_Treatment_Standard_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le taux de mes réglages s'applique.`)
};

/**
* | output |
* | --- |
* | "The rate from my settings applies." |
*
* @param {Vat_Treatment_Standard_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const vat_treatment_standard_hint = /** @type {((inputs?: Vat_Treatment_Standard_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Vat_Treatment_Standard_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_vat_treatment_standard_hint(inputs)
	return en_vat_treatment_standard_hint(inputs)
});