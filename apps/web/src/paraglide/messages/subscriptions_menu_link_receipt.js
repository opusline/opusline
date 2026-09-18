/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ month: NonNullable<unknown> }} Subscriptions_Menu_Link_ReceiptInputs */

const en_subscriptions_menu_link_receipt = /** @type {(inputs: Subscriptions_Menu_Link_ReceiptInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Link the ${i?.month} receipt`)
};

const fr_subscriptions_menu_link_receipt = /** @type {(inputs: Subscriptions_Menu_Link_ReceiptInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Lier la facture de ${i?.month}`)
};

/**
* | output |
* | --- |
* | "Link the {month} receipt" |
*
* @param {Subscriptions_Menu_Link_ReceiptInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_menu_link_receipt = /** @type {((inputs: Subscriptions_Menu_Link_ReceiptInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Menu_Link_ReceiptInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_menu_link_receipt(inputs)
	return en_subscriptions_menu_link_receipt(inputs)
});