/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quotes_Load_FailedInputs */

const en_quotes_load_failed = /** @type {(inputs: Quotes_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The quotes could not be loaded.`)
};

const fr_quotes_load_failed = /** @type {(inputs: Quotes_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les devis n'ont pas pu être chargés.`)
};

/**
* | output |
* | --- |
* | "The quotes could not be loaded." |
*
* @param {Quotes_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quotes_load_failed = /** @type {((inputs?: Quotes_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quotes_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quotes_load_failed(inputs)
	return en_quotes_load_failed(inputs)
});