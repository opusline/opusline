/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Enable_Banking_Step_LinkInputs */



/**
* | output |
* | --- |
* | "Activate it by linking your bank account to it." |
*
* @param {Integrations_Enable_Banking_Step_LinkInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_enable_banking_step_link = /** @type {((inputs?: Integrations_Enable_Banking_Step_LinkInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Enable_Banking_Step_LinkInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Activez-la en y liant votre compte bancaire.")
	return /** @type {LocalizedString} */ ("Activate it by linking your bank account to it.")
});