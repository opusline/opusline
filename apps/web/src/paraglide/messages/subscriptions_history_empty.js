/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_History_EmptyInputs */

const en_subscriptions_history_empty = /** @type {(inputs: Subscriptions_History_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No amount change yet.`)
};

const fr_subscriptions_history_empty = /** @type {(inputs: Subscriptions_History_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucun changement de montant pour l'instant.`)
};

/**
* | output |
* | --- |
* | "No amount change yet." |
*
* @param {Subscriptions_History_EmptyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_history_empty = /** @type {((inputs?: Subscriptions_History_EmptyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_History_EmptyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_history_empty(inputs)
	return en_subscriptions_history_empty(inputs)
});