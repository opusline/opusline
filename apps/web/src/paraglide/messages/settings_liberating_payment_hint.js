/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ rate: NonNullable<unknown> }} Settings_Liberating_Payment_HintInputs */

const en_settings_liberating_payment_hint = /** @type {(inputs: Settings_Liberating_Payment_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Adds ${i?.rate} % to the contributions and removes the annual income tax.`)
};

const fr_settings_liberating_payment_hint = /** @type {(inputs: Settings_Liberating_Payment_HintInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Ajoute ${i?.rate} % aux cotisations et supprime l'IR annuel.`)
};

/**
* | output |
* | --- |
* | "Adds {rate} % to the contributions and removes the annual income tax." |
*
* @param {Settings_Liberating_Payment_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_liberating_payment_hint = /** @type {((inputs: Settings_Liberating_Payment_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Liberating_Payment_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_liberating_payment_hint(inputs)
	return en_settings_liberating_payment_hint(inputs)
});