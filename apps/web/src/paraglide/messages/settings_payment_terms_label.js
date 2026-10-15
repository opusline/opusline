/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Payment_Terms_LabelInputs */

const en_settings_payment_terms_label = /** @type {(inputs: Settings_Payment_Terms_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Default payment terms`)
};

const fr_settings_payment_terms_label = /** @type {(inputs: Settings_Payment_Terms_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Délai de paiement par défaut`)
};

/**
* | output |
* | --- |
* | "Default payment terms" |
*
* @param {Settings_Payment_Terms_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_payment_terms_label = /** @type {((inputs?: Settings_Payment_Terms_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Payment_Terms_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_payment_terms_label(inputs)
	return en_settings_payment_terms_label(inputs)
});