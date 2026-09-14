/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_History_CaptionInputs */

const en_subscriptions_history_caption = /** @type {(inputs: Subscriptions_History_CaptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`past expenses keep the old amount`)
};

const fr_subscriptions_history_caption = /** @type {(inputs: Subscriptions_History_CaptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`les dépenses passées gardent l'ancien montant`)
};

/**
* | output |
* | --- |
* | "past expenses keep the old amount" |
*
* @param {Subscriptions_History_CaptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_history_caption = /** @type {((inputs?: Subscriptions_History_CaptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_History_CaptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_history_caption(inputs)
	return en_subscriptions_history_caption(inputs)
});