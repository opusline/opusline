/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Type_Hint_EsnInputs */



/**
* | output |
* | --- |
* | "You bill the ESN, which bills its end client." |
*
* @param {Clients_Type_Hint_EsnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_type_hint_esn = /** @type {((inputs?: Clients_Type_Hint_EsnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Type_Hint_EsnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Vous facturez l'ESN, qui facture son client final.")
	return /** @type {LocalizedString} */ ("You bill the ESN, which bills its end client.")
});