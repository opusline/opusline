/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Enable_Banking_SaveInputs */

const en_integrations_enable_banking_save = /** @type {(inputs: Integrations_Enable_Banking_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Save the application`)
};

const fr_integrations_enable_banking_save = /** @type {(inputs: Integrations_Enable_Banking_SaveInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enregistrer l'application`)
};

/**
* | output |
* | --- |
* | "Save the application" |
*
* @param {Integrations_Enable_Banking_SaveInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_enable_banking_save = /** @type {((inputs?: Integrations_Enable_Banking_SaveInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Enable_Banking_SaveInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_enable_banking_save(inputs)
	return en_integrations_enable_banking_save(inputs)
});