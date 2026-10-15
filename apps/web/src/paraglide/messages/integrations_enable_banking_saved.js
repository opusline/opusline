/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Enable_Banking_SavedInputs */



/**
* | output |
* | --- |
* | "Application saved: connect your bank from the Business account page." |
*
* @param {Integrations_Enable_Banking_SavedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_enable_banking_saved = /** @type {((inputs?: Integrations_Enable_Banking_SavedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Enable_Banking_SavedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Application enregistrée : connectez votre banque depuis la page Compte pro.")
	return /** @type {LocalizedString} */ ("Application saved: connect your bank from the Business account page.")
});