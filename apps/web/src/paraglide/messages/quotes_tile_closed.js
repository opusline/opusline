/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quotes_Tile_ClosedInputs */

const en_quotes_tile_closed = /** @type {(inputs: Quotes_Tile_ClosedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expired or refused`)
};

const fr_quotes_tile_closed = /** @type {(inputs: Quotes_Tile_ClosedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Expirés ou refusés`)
};

/**
* | output |
* | --- |
* | "Expired or refused" |
*
* @param {Quotes_Tile_ClosedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quotes_tile_closed = /** @type {((inputs?: Quotes_Tile_ClosedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quotes_Tile_ClosedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quotes_tile_closed(inputs)
	return en_quotes_tile_closed(inputs)
});