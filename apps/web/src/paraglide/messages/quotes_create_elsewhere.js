/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quotes_Create_ElsewhereInputs */

const en_quotes_create_elsewhere = /** @type {(inputs: Quotes_Create_ElsewhereInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Add a quote issued elsewhere`)
};

const fr_quotes_create_elsewhere = /** @type {(inputs: Quotes_Create_ElsewhereInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ajouter un devis émis ailleurs`)
};

/**
* | output |
* | --- |
* | "Add a quote issued elsewhere" |
*
* @param {Quotes_Create_ElsewhereInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quotes_create_elsewhere = /** @type {((inputs?: Quotes_Create_ElsewhereInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quotes_Create_ElsewhereInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quotes_create_elsewhere(inputs)
	return en_quotes_create_elsewhere(inputs)
});