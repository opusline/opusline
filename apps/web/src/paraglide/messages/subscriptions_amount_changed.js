/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Amount_ChangedInputs */



/**
* | output |
* | --- |
* | "New amount saved · past expenses keep the old one" |
*
* @param {Subscriptions_Amount_ChangedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_amount_changed = /** @type {((inputs?: Subscriptions_Amount_ChangedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Amount_ChangedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	void inputs;
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return /** @type {LocalizedString} */ ("Nouveau montant enregistré · les dépenses passées gardent l'ancien")
	return /** @type {LocalizedString} */ ("New amount saved · past expenses keep the old one")
});