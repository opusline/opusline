/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown>, date: NonNullable<unknown> }} Payments_Deducted_OnInputs */

const en_payments_deducted_on = /** @type {(inputs: Payments_Deducted_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} deducted from a credit note on ${i?.date}`)
};

const fr_payments_deducted_on = /** @type {(inputs: Payments_Deducted_OnInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} déduits d'un avoir le ${i?.date}`)
};

/**
* | output |
* | --- |
* | "{amount} deducted from a credit note on {date}" |
*
* @param {Payments_Deducted_OnInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const payments_deducted_on = /** @type {((inputs: Payments_Deducted_OnInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Payments_Deducted_OnInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_payments_deducted_on(inputs)
	return en_payments_deducted_on(inputs)
});