/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ balance: NonNullable<unknown> }} Treasury_On_BalanceInputs */

const en_treasury_on_balance = /** @type {(inputs: Treasury_On_BalanceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`on a pro balance of ${i?.balance}`)
};

const fr_treasury_on_balance = /** @type {(inputs: Treasury_On_BalanceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`sur un solde pro de ${i?.balance}`)
};

/**
* | output |
* | --- |
* | "on a pro balance of {balance}" |
*
* @param {Treasury_On_BalanceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_on_balance = /** @type {((inputs: Treasury_On_BalanceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_On_BalanceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_on_balance(inputs)
	return en_treasury_on_balance(inputs)
});