/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ rate: NonNullable<unknown> }} Paste_Filled_DepositInputs */

const en_paste_filled_deposit = /** @type {(inputs: Paste_Filled_DepositInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Deposit ${i?.rate} %`)
};

const fr_paste_filled_deposit = /** @type {(inputs: Paste_Filled_DepositInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Acompte ${i?.rate} %`)
};

/**
* | output |
* | --- |
* | "Deposit {rate} %" |
*
* @param {Paste_Filled_DepositInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const paste_filled_deposit = /** @type {((inputs: Paste_Filled_DepositInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Paste_Filled_DepositInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_paste_filled_deposit(inputs)
	return en_paste_filled_deposit(inputs)
});