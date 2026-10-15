/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Enable_Banking_Step_RedirectInputs */



/**
* | output |
* | --- |
* | "Add this redirect URL to it:" |
*
* @param {Integrations_Enable_Banking_Step_RedirectInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_enable_banking_step_redirect = /** @type {((inputs?: Integrations_Enable_Banking_Step_RedirectInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Enable_Banking_Step_RedirectInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Ajoutez-y cette URL de redirection :")
	return /** @type {LocalizedString} */ ("Add this redirect URL to it:")
});