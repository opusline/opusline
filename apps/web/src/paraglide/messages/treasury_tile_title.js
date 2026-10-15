/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Tile_TitleInputs */

const en_treasury_tile_title = /** @type {(inputs: Treasury_Tile_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Safe to transfer`)
};

const fr_treasury_tile_title = /** @type {(inputs: Treasury_Tile_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Virable en sécurité`)
};

/**
* | output |
* | --- |
* | "Safe to transfer" |
*
* @param {Treasury_Tile_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_tile_title = /** @type {((inputs?: Treasury_Tile_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Tile_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_tile_title(inputs)
	return en_treasury_tile_title(inputs)
});