/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_History_TitleInputs */

const en_subscriptions_history_title = /** @type {(inputs: Subscriptions_History_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Amount history`)
};

const fr_subscriptions_history_title = /** @type {(inputs: Subscriptions_History_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Historique des montants`)
};

/**
* | output |
* | --- |
* | "Amount history" |
*
* @param {Subscriptions_History_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_history_title = /** @type {((inputs?: Subscriptions_History_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_History_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_history_title(inputs)
	return en_subscriptions_history_title(inputs)
});