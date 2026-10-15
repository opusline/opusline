/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoices_Add_IntroInputs */



/**
* | output |
* | --- |
* | "Opusline does not produce the document. Record the invoice your billing tool issued so it can be followed here." |
*
* @param {Invoices_Add_IntroInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoices_add_intro = /** @type {((inputs?: Invoices_Add_IntroInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoices_Add_IntroInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Opusline ne génère pas le document. Renseignez la facture émise par votre outil pour la suivre ici.")
	return /** @type {LocalizedString} */ ("Opusline does not produce the document. Record the invoice your billing tool issued so it can be followed here.")
});