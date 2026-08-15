/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Provisioned_Rate_LabelInputs */

const en_settings_provisioned_rate_label = /** @type {(inputs: Settings_Provisioned_Rate_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Provisioned contributions`)
};

const fr_settings_provisioned_rate_label = /** @type {(inputs: Settings_Provisioned_Rate_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Charges provisionnées`)
};

/**
* | output |
* | --- |
* | "Provisioned contributions" |
*
* @param {Settings_Provisioned_Rate_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_provisioned_rate_label = /** @type {((inputs?: Settings_Provisioned_Rate_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Provisioned_Rate_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_provisioned_rate_label(inputs)
	return en_settings_provisioned_rate_label(inputs)
});