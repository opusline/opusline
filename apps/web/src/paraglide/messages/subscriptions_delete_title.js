/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Delete_TitleInputs */

const en_subscriptions_delete_title = /** @type {(inputs: Subscriptions_Delete_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Delete this subscription?`)
};

const fr_subscriptions_delete_title = /** @type {(inputs: Subscriptions_Delete_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Supprimer cet abonnement ?`)
};

/**
* | output |
* | --- |
* | "Delete this subscription?" |
*
* @param {Subscriptions_Delete_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_delete_title = /** @type {((inputs?: Subscriptions_Delete_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Delete_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_delete_title(inputs)
	return en_subscriptions_delete_title(inputs)
});