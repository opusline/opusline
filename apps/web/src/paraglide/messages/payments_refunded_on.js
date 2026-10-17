/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown>, date: NonNullable<unknown> }} Payments_Refunded_OnInputs */

const en_payments_refunded_on = /** @type {(inputs: Payments_Refunded_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} returned to the client on ${i?.date}`)
};

const fr_payments_refunded_on = /** @type {(inputs: Payments_Refunded_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} rendus au client le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "{amount} returned to the client on {date}" |
*
* @param {Payments_Refunded_OnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const payments_refunded_on = /** @type {((inputs: Payments_Refunded_OnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Payments_Refunded_OnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_payments_refunded_on(inputs)
	return en_payments_refunded_on(inputs)
});