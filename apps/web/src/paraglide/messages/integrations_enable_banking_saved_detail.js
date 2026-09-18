/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ id: NonNullable<unknown> }} Integrations_Enable_Banking_Saved_DetailInputs */

const en_integrations_enable_banking_saved_detail = /** @type {(inputs: Integrations_Enable_Banking_Saved_DetailInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`ID ${i?.id}`)
};

const fr_integrations_enable_banking_saved_detail = /** @type {(inputs: Integrations_Enable_Banking_Saved_DetailInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Identifiant ${i?.id}`)
};

/**
* | output |
* | --- |
* | "ID {id}" |
*
* @param {Integrations_Enable_Banking_Saved_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_enable_banking_saved_detail = /** @type {((inputs: Integrations_Enable_Banking_Saved_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Enable_Banking_Saved_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_enable_banking_saved_detail(inputs)
	return en_integrations_enable_banking_saved_detail(inputs)
});