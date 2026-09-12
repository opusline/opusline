/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Amount_ChangedInputs */

const en_subscriptions_amount_changed = /** @type {(inputs: Subscriptions_Amount_ChangedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New amount saved · past expenses keep the old one`)
};

const fr_subscriptions_amount_changed = /** @type {(inputs: Subscriptions_Amount_ChangedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nouveau montant enregistré · les dépenses passées gardent l'ancien`)
};

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
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_amount_changed(inputs)
	return en_subscriptions_amount_changed(inputs)
});