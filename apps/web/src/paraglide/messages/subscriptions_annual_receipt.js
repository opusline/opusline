/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ month: NonNullable<unknown> }} Subscriptions_Annual_ReceiptInputs */

const en_subscriptions_annual_receipt = /** @type {(inputs: Subscriptions_Annual_ReceiptInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`1 receipt / year · ${i?.month}`)
};

const fr_subscriptions_annual_receipt = /** @type {(inputs: Subscriptions_Annual_ReceiptInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`1 facture / an · ${i?.month}`)
};

/**
* | output |
* | --- |
* | "1 receipt / year · {month}" |
*
* @param {Subscriptions_Annual_ReceiptInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_annual_receipt = /** @type {((inputs: Subscriptions_Annual_ReceiptInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Annual_ReceiptInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_annual_receipt(inputs)
	return en_subscriptions_annual_receipt(inputs)
});