/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quotes_Empty_NoneInputs */

const en_quotes_empty_none = /** @type {(inputs: Quotes_Empty_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Write your first quote: Opusline numbers it on validation and renders the PDF with its « Bon pour accord » box.`)
};

const fr_quotes_empty_none = /** @type {(inputs: Quotes_Empty_NoneInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rédigez votre premier devis : Opusline le numérote à la validation et génère le PDF avec sa case « Bon pour accord ».`)
};

/**
* | output |
* | --- |
* | "Write your first quote: Opusline numbers it on validation and renders the PDF with its « Bon pour accord » box." |
*
* @param {Quotes_Empty_NoneInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quotes_empty_none = /** @type {((inputs?: Quotes_Empty_NoneInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quotes_Empty_NoneInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quotes_empty_none(inputs)
	return en_quotes_empty_none(inputs)
});