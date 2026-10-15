/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Clients_Payment_Terms_HintInputs */



/**
* | output |
* | --- |
* | "Used to compute the due date and flag late payments. Default: 45 days." |
*
* @param {Clients_Payment_Terms_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_payment_terms_hint = /** @type {((inputs?: Clients_Payment_Terms_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Payment_Terms_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Sert à calculer la date d'échéance et à signaler les retards. Par défaut : 45 jours.")
	return /** @type {LocalizedString} */ ("Used to compute the due date and flag late payments. Default: 45 days.")
});