/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Empty_HintInputs */



/**
* | output |
* | --- |
* | "It carries the billing details and the payment terms. Its missions come next." |
*
* @param {Clients_Empty_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_empty_hint = /** @type {((inputs?: Clients_Empty_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Empty_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Il porte les coordonnées de facturation et le délai de paiement. Ses missions viennent ensuite.")
	return /** @type {LocalizedString} */ ("It carries the billing details and the payment terms. Its missions come next.")
});