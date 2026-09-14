/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Menu_Change_AmountInputs */

const en_subscriptions_menu_change_amount = /** @type {(inputs: Subscriptions_Menu_Change_AmountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Change the amount (from…)`)
};

const fr_subscriptions_menu_change_amount = /** @type {(inputs: Subscriptions_Menu_Change_AmountInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Changer le montant (à partir du…)`)
};

/**
* | output |
* | --- |
* | "Change the amount (from…)" |
*
* @param {Subscriptions_Menu_Change_AmountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_menu_change_amount = /** @type {((inputs?: Subscriptions_Menu_Change_AmountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Menu_Change_AmountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_menu_change_amount(inputs)
	return en_subscriptions_menu_change_amount(inputs)
});