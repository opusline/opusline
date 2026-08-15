/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Vat_Regime_Simplified_HintInputs */

const en_vat_regime_simplified_hint = /** @type {(inputs: Vat_Regime_Simplified_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`VAT-liable · yearly CA12`)
};

const fr_vat_regime_simplified_hint = /** @type {(inputs: Vat_Regime_Simplified_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Assujetti · CA12 annuelle`)
};

/**
* | output |
* | --- |
* | "VAT-liable · yearly CA12" |
*
* @param {Vat_Regime_Simplified_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const vat_regime_simplified_hint = /** @type {((inputs?: Vat_Regime_Simplified_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Vat_Regime_Simplified_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_vat_regime_simplified_hint(inputs)
	return en_vat_regime_simplified_hint(inputs)
});