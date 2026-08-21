/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown> }} Treasury_Hero_On_BalanceInputs */

const en_treasury_hero_on_balance = /** @type {(inputs: Treasury_Hero_On_BalanceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`on a business balance of ${i?.amount}`)
};

const fr_treasury_hero_on_balance = /** @type {(inputs: Treasury_Hero_On_BalanceInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`sur un solde pro de ${i?.amount}`)
};

/**
* | output |
* | --- |
* | "on a business balance of {amount}" |
*
* @param {Treasury_Hero_On_BalanceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_hero_on_balance = /** @type {((inputs: Treasury_Hero_On_BalanceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Hero_On_BalanceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_hero_on_balance(inputs)
	return en_treasury_hero_on_balance(inputs)
});