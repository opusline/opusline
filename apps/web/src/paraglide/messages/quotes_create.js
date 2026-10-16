/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quotes_CreateInputs */

const en_quotes_create = /** @type {(inputs: Quotes_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`New quote`)
};

const fr_quotes_create = /** @type {(inputs: Quotes_CreateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nouveau devis`)
};

/**
* | output |
* | --- |
* | "New quote" |
*
* @param {Quotes_CreateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quotes_create = /** @type {((inputs?: Quotes_CreateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quotes_CreateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quotes_create(inputs)
	return en_quotes_create(inputs)
});