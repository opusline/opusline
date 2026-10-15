/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Contribution_Rate_HintInputs */

const en_settings_contribution_rate_hint = /** @type {(inputs: Settings_Contribution_Rate_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`BNC service-provider rate, read from the URSSAF.`)
};

const fr_settings_contribution_rate_hint = /** @type {(inputs: Settings_Contribution_Rate_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Taux BNC prestations de service, repris de l'URSSAF.`)
};

/**
* | output |
* | --- |
* | "BNC service-provider rate, read from the URSSAF." |
*
* @param {Settings_Contribution_Rate_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_contribution_rate_hint = /** @type {((inputs?: Settings_Contribution_Rate_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Contribution_Rate_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_contribution_rate_hint(inputs)
	return en_settings_contribution_rate_hint(inputs)
});