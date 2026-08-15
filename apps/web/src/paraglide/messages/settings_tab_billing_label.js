/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Tab_Billing_LabelInputs */

const en_settings_tab_billing_label = /** @type {(inputs: Settings_Tab_Billing_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Billing`)
};

const fr_settings_tab_billing_label = /** @type {(inputs: Settings_Tab_Billing_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facturation`)
};

/**
* | output |
* | --- |
* | "Billing" |
*
* @param {Settings_Tab_Billing_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_tab_billing_label = /** @type {((inputs?: Settings_Tab_Billing_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Tab_Billing_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_tab_billing_label(inputs)
	return en_settings_tab_billing_label(inputs)
});