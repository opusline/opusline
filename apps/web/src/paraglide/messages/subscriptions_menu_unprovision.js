/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Menu_UnprovisionInputs */

const en_subscriptions_menu_unprovision = /** @type {(inputs: Subscriptions_Menu_UnprovisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Stop setting aside`)
};

const fr_subscriptions_menu_unprovision = /** @type {(inputs: Subscriptions_Menu_UnprovisionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ne plus provisionner`)
};

/**
* | output |
* | --- |
* | "Stop setting aside" |
*
* @param {Subscriptions_Menu_UnprovisionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_menu_unprovision = /** @type {((inputs?: Subscriptions_Menu_UnprovisionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Menu_UnprovisionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_menu_unprovision(inputs)
	return en_subscriptions_menu_unprovision(inputs)
});