/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Quotes_Page_IntroInputs */

const en_quotes_page_intro = /** @type {(inputs: Quotes_Page_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Write a quote, send it, record the client's answer. An accepted quote is what the invoices will be built on.`)
};

const fr_quotes_page_intro = /** @type {(inputs: Quotes_Page_IntroInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rédigez un devis, envoyez-le, notez la réponse du client. Un devis accepté est ce sur quoi les factures s'appuieront.`)
};

/**
* | output |
* | --- |
* | "Write a quote, send it, record the client's answer. An accepted quote is what the invoices will be built on." |
*
* @param {Quotes_Page_IntroInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const quotes_page_intro = /** @type {((inputs?: Quotes_Page_IntroInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Quotes_Page_IntroInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_quotes_page_intro(inputs)
	return en_quotes_page_intro(inputs)
});