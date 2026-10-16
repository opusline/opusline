/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quotes_Tile_OpenInputs */

const en_quotes_tile_open = /** @type {(inputs: Quotes_Tile_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Awaiting answer`)
};

const fr_quotes_tile_open = /** @type {(inputs: Quotes_Tile_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`En attente`)
};

/**
* | output |
* | --- |
* | "Awaiting answer" |
*
* @param {Quotes_Tile_OpenInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quotes_tile_open = /** @type {((inputs?: Quotes_Tile_OpenInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quotes_Tile_OpenInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quotes_tile_open(inputs)
	return en_quotes_tile_open(inputs)
});