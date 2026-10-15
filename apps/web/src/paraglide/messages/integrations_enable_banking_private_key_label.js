/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Enable_Banking_Private_Key_LabelInputs */

const en_integrations_enable_banking_private_key_label = /** @type {(inputs: Integrations_Enable_Banking_Private_Key_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Private key`)
};

const fr_integrations_enable_banking_private_key_label = /** @type {(inputs: Integrations_Enable_Banking_Private_Key_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Clé privée`)
};

/**
* | output |
* | --- |
* | "Private key" |
*
* @param {Integrations_Enable_Banking_Private_Key_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_enable_banking_private_key_label = /** @type {((inputs?: Integrations_Enable_Banking_Private_Key_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Enable_Banking_Private_Key_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_enable_banking_private_key_label(inputs)
	return en_integrations_enable_banking_private_key_label(inputs)
});