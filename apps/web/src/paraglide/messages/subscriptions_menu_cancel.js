/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Menu_CancelInputs */

const en_subscriptions_menu_cancel = /** @type {(inputs: Subscriptions_Menu_CancelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cancel the subscription`)
};

const fr_subscriptions_menu_cancel = /** @type {(inputs: Subscriptions_Menu_CancelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Résilier`)
};

/**
* | output |
* | --- |
* | "Cancel the subscription" |
*
* @param {Subscriptions_Menu_CancelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_menu_cancel = /** @type {((inputs?: Subscriptions_Menu_CancelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Menu_CancelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_menu_cancel(inputs)
	return en_subscriptions_menu_cancel(inputs)
});