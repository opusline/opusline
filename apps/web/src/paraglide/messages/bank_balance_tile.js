/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Balance_TileInputs */

const en_bank_balance_tile = /** @type {(inputs: Bank_Balance_TileInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Current balance`)
};

const fr_bank_balance_tile = /** @type {(inputs: Bank_Balance_TileInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Solde courant`)
};

/**
* | output |
* | --- |
* | "Current balance" |
*
* @param {Bank_Balance_TileInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_balance_tile = /** @type {((inputs?: Bank_Balance_TileInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Balance_TileInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_balance_tile(inputs)
	return en_bank_balance_tile(inputs)
});