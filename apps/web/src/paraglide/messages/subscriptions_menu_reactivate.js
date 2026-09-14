/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Menu_ReactivateInputs */

const en_subscriptions_menu_reactivate = /** @type {(inputs: Subscriptions_Menu_ReactivateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Reactivate`)
};

const fr_subscriptions_menu_reactivate = /** @type {(inputs: Subscriptions_Menu_ReactivateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Réactiver`)
};

/**
* | output |
* | --- |
* | "Reactivate" |
*
* @param {Subscriptions_Menu_ReactivateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_menu_reactivate = /** @type {((inputs?: Subscriptions_Menu_ReactivateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Menu_ReactivateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_menu_reactivate(inputs)
	return en_subscriptions_menu_reactivate(inputs)
});