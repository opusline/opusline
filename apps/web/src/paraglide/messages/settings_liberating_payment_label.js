/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Liberating_Payment_LabelInputs */

const en_settings_liberating_payment_label = /** @type {(inputs: Settings_Liberating_Payment_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Versement libératoire of income tax`)
};

const fr_settings_liberating_payment_label = /** @type {(inputs: Settings_Liberating_Payment_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Versement libératoire de l'impôt`)
};

/**
* | output |
* | --- |
* | "Versement libératoire of income tax" |
*
* @param {Settings_Liberating_Payment_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_liberating_payment_label = /** @type {((inputs?: Settings_Liberating_Payment_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Liberating_Payment_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_liberating_payment_label(inputs)
	return en_settings_liberating_payment_label(inputs)
});