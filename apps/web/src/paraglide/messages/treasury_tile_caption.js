/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Tile_CaptionInputs */

const en_treasury_tile_caption = /** @type {(inputs: Treasury_Tile_CaptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`provisions deducted`)
};

const fr_treasury_tile_caption = /** @type {(inputs: Treasury_Tile_CaptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`provisions déduites`)
};

/**
* | output |
* | --- |
* | "provisions deducted" |
*
* @param {Treasury_Tile_CaptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_tile_caption = /** @type {((inputs?: Treasury_Tile_CaptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Tile_CaptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_tile_caption(inputs)
	return en_treasury_tile_caption(inputs)
});