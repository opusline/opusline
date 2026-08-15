/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Vat_Regime_Normal_LabelInputs */

const en_vat_regime_normal_label = /** @type {(inputs: Vat_Regime_Normal_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Réel normal`)
};

const fr_vat_regime_normal_label = /** @type {(inputs: Vat_Regime_Normal_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Réel normal`)
};

/**
* | output |
* | --- |
* | "Réel normal" |
*
* @param {Vat_Regime_Normal_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const vat_regime_normal_label = /** @type {((inputs?: Vat_Regime_Normal_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Vat_Regime_Normal_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_vat_regime_normal_label(inputs)
	return en_vat_regime_normal_label(inputs)
});