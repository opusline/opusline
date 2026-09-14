/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ month: NonNullable<unknown>, supplier: NonNullable<unknown> }} Subscriptions_Receipt_LinkedInputs */

const en_subscriptions_receipt_linked = /** @type {(inputs: Subscriptions_Receipt_LinkedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.month} receipt linked · ${i?.supplier}`)
};

const fr_subscriptions_receipt_linked = /** @type {(inputs: Subscriptions_Receipt_LinkedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Facture ${i?.month} liée · ${i?.supplier}`)
};

/**
* | output |
* | --- |
* | "{month} receipt linked · {supplier}" |
*
* @param {Subscriptions_Receipt_LinkedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_receipt_linked = /** @type {((inputs: Subscriptions_Receipt_LinkedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Receipt_LinkedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_receipt_linked(inputs)
	return en_subscriptions_receipt_linked(inputs)
});