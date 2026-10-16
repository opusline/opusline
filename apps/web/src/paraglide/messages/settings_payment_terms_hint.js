/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Payment_Terms_HintInputs */

const en_settings_payment_terms_hint = /** @type {(inputs: Settings_Payment_Terms_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Beyond 60 days, keep the statutory late-payment penalties in mind.`)
};

const fr_settings_payment_terms_hint = /** @type {(inputs: Settings_Payment_Terms_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Au-delà de 60 jours, pensez aux pénalités de retard légales.`)
};

/**
* | output |
* | --- |
* | "Beyond 60 days, keep the statutory late-payment penalties in mind." |
*
* @param {Settings_Payment_Terms_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_payment_terms_hint = /** @type {((inputs?: Settings_Payment_Terms_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Payment_Terms_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_payment_terms_hint(inputs)
	return en_settings_payment_terms_hint(inputs)
});