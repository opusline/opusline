/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Enable_Banking_Copy_RedirectInputs */



/**
* | output |
* | --- |
* | "Copy the redirect URL" |
*
* @param {Integrations_Enable_Banking_Copy_RedirectInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_enable_banking_copy_redirect = /** @type {((inputs?: Integrations_Enable_Banking_Copy_RedirectInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Enable_Banking_Copy_RedirectInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Copier l'URL de redirection")
	return /** @type {LocalizedString} */ ("Copy the redirect URL")
});