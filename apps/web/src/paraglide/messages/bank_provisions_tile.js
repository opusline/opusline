/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Provisions_TileInputs */

const en_bank_provisions_tile = /** @type {(inputs: Bank_Provisions_TileInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Provisions to keep`)
};

const fr_bank_provisions_tile = /** @type {(inputs: Bank_Provisions_TileInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Provisions à garder`)
};

/**
* | output |
* | --- |
* | "Provisions to keep" |
*
* @param {Bank_Provisions_TileInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_provisions_tile = /** @type {((inputs?: Bank_Provisions_TileInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Provisions_TileInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_provisions_tile(inputs)
	return en_bank_provisions_tile(inputs)
});