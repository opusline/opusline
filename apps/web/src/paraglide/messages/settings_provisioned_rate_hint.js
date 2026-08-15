/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Provisioned_Rate_HintInputs */

const en_settings_provisioned_rate_hint = /** @type {(inputs: Settings_Provisioned_Rate_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Social contributions only. Income tax remains due annually.`)
};

const fr_settings_provisioned_rate_hint = /** @type {(inputs: Settings_Provisioned_Rate_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cotisations sociales seules. L'impôt sur le revenu reste dû annuellement.`)
};

/**
* | output |
* | --- |
* | "Social contributions only. Income tax remains due annually." |
*
* @param {Settings_Provisioned_Rate_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_provisioned_rate_hint = /** @type {((inputs?: Settings_Provisioned_Rate_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Provisioned_Rate_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_provisioned_rate_hint(inputs)
	return en_settings_provisioned_rate_hint(inputs)
});