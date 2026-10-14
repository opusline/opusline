/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Billing_Moved_LinkInputs */

const en_settings_billing_moved_link = /** @type {(inputs: Settings_Billing_Moved_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`the invoicing settings`)
};

const fr_settings_billing_moved_link = /** @type {(inputs: Settings_Billing_Moved_LinkInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`les réglages de facturation`)
};

/**
* | output |
* | --- |
* | "the invoicing settings" |
*
* @param {Settings_Billing_Moved_LinkInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_billing_moved_link = /** @type {((inputs?: Settings_Billing_Moved_LinkInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Billing_Moved_LinkInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_billing_moved_link(inputs)
	return en_settings_billing_moved_link(inputs)
});