/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quotes_Create_In_OpuslineInputs */

const en_quotes_create_in_opusline = /** @type {(inputs: Quotes_Create_In_OpuslineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Write a quote`)
};

const fr_quotes_create_in_opusline = /** @type {(inputs: Quotes_Create_In_OpuslineInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rédiger un devis`)
};

/**
* | output |
* | --- |
* | "Write a quote" |
*
* @param {Quotes_Create_In_OpuslineInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quotes_create_in_opusline = /** @type {((inputs?: Quotes_Create_In_OpuslineInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quotes_Create_In_OpuslineInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quotes_create_in_opusline(inputs)
	return en_quotes_create_in_opusline(inputs)
});