/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Auto_Create_OffInputs */



/**
* | output |
* | --- |
* | "No expense is created. The subscription stays tracked here (due dates, yearly budget, provision), but each expense must be added by hand." |
*
* @param {Subscriptions_Auto_Create_OffInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_auto_create_off = /** @type {((inputs?: Subscriptions_Auto_Create_OffInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Auto_Create_OffInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Aucune dépense ne sera créée. L'abonnement reste suivi ici (échéances, budget annuel, provision), mais chaque dépense devra être ajoutée à la main.")
	return /** @type {LocalizedString} */ ("No expense is created. The subscription stays tracked here (due dates, yearly budget, provision), but each expense must be added by hand.")
});