/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown>, rate: NonNullable<unknown> }} Quote_Tracking_Deposit_ValueInputs */

const en_quote_tracking_deposit_value = /** @type {(inputs: Quote_Tracking_Deposit_ValueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} · ${i?.rate} %`)
};

const fr_quote_tracking_deposit_value = /** @type {(inputs: Quote_Tracking_Deposit_ValueInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} · ${i?.rate} %`)
};

/**
* | output |
* | --- |
* | "{amount} · {rate} %" |
*
* @param {Quote_Tracking_Deposit_ValueInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_tracking_deposit_value = /** @type {((inputs: Quote_Tracking_Deposit_ValueInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Tracking_Deposit_ValueInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_tracking_deposit_value(inputs)
	return en_quote_tracking_deposit_value(inputs)
});