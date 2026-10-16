/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_RefuseInputs */

const en_quote_refuse = /** @type {(inputs: Quote_RefuseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mark as refused`)
};

const fr_quote_refuse = /** @type {(inputs: Quote_RefuseInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Marquer refusé`)
};

/**
* | output |
* | --- |
* | "Mark as refused" |
*
* @param {Quote_RefuseInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_refuse = /** @type {((inputs?: Quote_RefuseInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_RefuseInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_refuse(inputs)
	return en_quote_refuse(inputs)
});