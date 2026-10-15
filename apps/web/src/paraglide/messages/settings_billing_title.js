/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Billing_TitleInputs */

const en_settings_billing_title = /** @type {(inputs: Settings_Billing_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Billing and treasury`)
};

const fr_settings_billing_title = /** @type {(inputs: Settings_Billing_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facturation et trésorerie`)
};

/**
* | output |
* | --- |
* | "Billing and treasury" |
*
* @param {Settings_Billing_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_billing_title = /** @type {((inputs?: Settings_Billing_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Billing_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_billing_title(inputs)
	return en_settings_billing_title(inputs)
});