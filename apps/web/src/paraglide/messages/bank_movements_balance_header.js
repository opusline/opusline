/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Movements_Balance_HeaderInputs */

const en_bank_movements_balance_header = /** @type {(inputs: Bank_Movements_Balance_HeaderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Balance`)
};

const fr_bank_movements_balance_header = /** @type {(inputs: Bank_Movements_Balance_HeaderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Solde`)
};

/**
* | output |
* | --- |
* | "Balance" |
*
* @param {Bank_Movements_Balance_HeaderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_movements_balance_header = /** @type {((inputs?: Bank_Movements_Balance_HeaderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Movements_Balance_HeaderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_movements_balance_header(inputs)
	return en_bank_movements_balance_header(inputs)
});