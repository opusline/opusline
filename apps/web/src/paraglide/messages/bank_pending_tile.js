/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Bank_Pending_TileInputs */

const en_bank_pending_tile = /** @type {(inputs: Bank_Pending_TileInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`To reconcile`)
};

const fr_bank_pending_tile = /** @type {(inputs: Bank_Pending_TileInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`À rapprocher`)
};

/**
* | output |
* | --- |
* | "To reconcile" |
*
* @param {Bank_Pending_TileInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const bank_pending_tile = /** @type {((inputs?: Bank_Pending_TileInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Bank_Pending_TileInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_bank_pending_tile(inputs)
	return en_bank_pending_tile(inputs)
});