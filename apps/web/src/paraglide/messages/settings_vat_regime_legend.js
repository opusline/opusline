/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Vat_Regime_LegendInputs */

const en_settings_vat_regime_legend = /** @type {(inputs: Settings_Vat_Regime_LegendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`VAT regime`)
};

const fr_settings_vat_regime_legend = /** @type {(inputs: Settings_Vat_Regime_LegendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Régime de TVA`)
};

/**
* | output |
* | --- |
* | "VAT regime" |
*
* @param {Settings_Vat_Regime_LegendInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_vat_regime_legend = /** @type {((inputs?: Settings_Vat_Regime_LegendInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Vat_Regime_LegendInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_vat_regime_legend(inputs)
	return en_settings_vat_regime_legend(inputs)
});