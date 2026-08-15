/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Vat_Regime_Franchise_HintInputs */

const en_vat_regime_franchise_hint = /** @type {(inputs: Vat_Regime_Franchise_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`I do not charge VAT`)
};

const fr_vat_regime_franchise_hint = /** @type {(inputs: Vat_Regime_Franchise_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Je ne facture pas la TVA`)
};

/**
* | output |
* | --- |
* | "I do not charge VAT" |
*
* @param {Vat_Regime_Franchise_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const vat_regime_franchise_hint = /** @type {((inputs?: Vat_Regime_Franchise_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Vat_Regime_Franchise_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_vat_regime_franchise_hint(inputs)
	return en_vat_regime_franchise_hint(inputs)
});