/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quotes_Create_OtherInputs */

const en_quotes_create_other = /** @type {(inputs: Quotes_Create_OtherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Other ways to add a quote`)
};

const fr_quotes_create_other = /** @type {(inputs: Quotes_Create_OtherInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Autres façons d'ajouter un devis`)
};

/**
* | output |
* | --- |
* | "Other ways to add a quote" |
*
* @param {Quotes_Create_OtherInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quotes_create_other = /** @type {((inputs?: Quotes_Create_OtherInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quotes_Create_OtherInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quotes_create_other(inputs)
	return en_quotes_create_other(inputs)
});