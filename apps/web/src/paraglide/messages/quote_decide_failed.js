/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quote_Decide_FailedInputs */

const en_quote_decide_failed = /** @type {(inputs: Quote_Decide_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The answer could not be recorded.`)
};

const fr_quote_decide_failed = /** @type {(inputs: Quote_Decide_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`La réponse n'a pas pu être enregistrée.`)
};

/**
* | output |
* | --- |
* | "The answer could not be recorded." |
*
* @param {Quote_Decide_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quote_decide_failed = /** @type {((inputs?: Quote_Decide_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quote_Decide_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quote_decide_failed(inputs)
	return en_quote_decide_failed(inputs)
});