/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Tab_Billing_HintInputs */

const en_settings_tab_billing_hint = /** @type {(inputs: Settings_Tab_Billing_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Terms, numbering, buffer`)
};

const fr_settings_tab_billing_hint = /** @type {(inputs: Settings_Tab_Billing_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Délais, numérotation, matelas`)
};

/**
* | output |
* | --- |
* | "Terms, numbering, buffer" |
*
* @param {Settings_Tab_Billing_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_tab_billing_hint = /** @type {((inputs?: Settings_Tab_Billing_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Tab_Billing_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_tab_billing_hint(inputs)
	return en_settings_tab_billing_hint(inputs)
});