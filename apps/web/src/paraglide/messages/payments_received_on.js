/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown>, date: NonNullable<unknown> }} Payments_Received_OnInputs */

const en_payments_received_on = /** @type {(inputs: Payments_Received_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} received on ${i?.date}`)
};

const fr_payments_received_on = /** @type {(inputs: Payments_Received_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} reçus le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "{amount} received on {date}" |
*
* @param {Payments_Received_OnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const payments_received_on = /** @type {((inputs: Payments_Received_OnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Payments_Received_OnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_payments_received_on(inputs)
	return en_payments_received_on(inputs)
});