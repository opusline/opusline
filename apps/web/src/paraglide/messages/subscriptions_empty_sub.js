/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Empty_SubInputs */



/**
* | output |
* | --- |
* | "Add your subscriptions: their expenses are created at each debit." |
*
* @param {Subscriptions_Empty_SubInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_empty_sub = /** @type {((inputs?: Subscriptions_Empty_SubInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Empty_SubInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Ajoutez vos abonnements : leurs dépenses seront créées à chaque prélèvement.")
	return /** @type {LocalizedString} */ ("Add your subscriptions: their expenses are created at each debit.")
});