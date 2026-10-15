/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Vat_Regime_Normal_HintInputs */

const en_vat_regime_normal_hint = /** @type {(inputs: Vat_Regime_Normal_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`VAT-liable · monthly CA3`)
};

const fr_vat_regime_normal_hint = /** @type {(inputs: Vat_Regime_Normal_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Assujetti · CA3 mensuelle`)
};

/**
* | output |
* | --- |
* | "VAT-liable · monthly CA3" |
*
* @param {Vat_Regime_Normal_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const vat_regime_normal_hint = /** @type {((inputs?: Vat_Regime_Normal_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Vat_Regime_Normal_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_vat_regime_normal_hint(inputs)
	return en_vat_regime_normal_hint(inputs)
});