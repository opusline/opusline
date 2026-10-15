/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Settings_Billing_DescriptionInputs */

const en_settings_billing_description = /** @type {(inputs: Settings_Billing_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Defaults offered when creating a client, and the threshold the Treasury page uses.`)
};

const fr_settings_billing_description = /** @type {(inputs: Settings_Billing_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Valeurs proposées à la création d'un client, et seuil utilisé par la page Trésorerie.`)
};

/**
* | output |
* | --- |
* | "Defaults offered when creating a client, and the threshold the Treasury page uses." |
*
* @param {Settings_Billing_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const settings_billing_description = /** @type {((inputs?: Settings_Billing_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Settings_Billing_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_settings_billing_description(inputs)
	return en_settings_billing_description(inputs)
});