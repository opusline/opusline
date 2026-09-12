/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Delete_ConfirmInputs */

const en_subscriptions_delete_confirm = /** @type {(inputs: Subscriptions_Delete_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete the subscription`)
};

const fr_subscriptions_delete_confirm = /** @type {(inputs: Subscriptions_Delete_ConfirmInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supprimer l'abonnement`)
};

/**
* | output |
* | --- |
* | "Delete the subscription" |
*
* @param {Subscriptions_Delete_ConfirmInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_delete_confirm = /** @type {((inputs?: Subscriptions_Delete_ConfirmInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Delete_ConfirmInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_delete_confirm(inputs)
	return en_subscriptions_delete_confirm(inputs)
});