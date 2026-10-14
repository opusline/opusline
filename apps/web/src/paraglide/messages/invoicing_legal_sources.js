/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Legal_SourcesInputs */

const en_invoicing_legal_sources = /** @type {(inputs: Invoicing_Legal_SourcesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sources`)
};

const fr_invoicing_legal_sources = /** @type {(inputs: Invoicing_Legal_SourcesInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Sources`)
};

/**
* | output |
* | --- |
* | "Sources" |
*
* @param {Invoicing_Legal_SourcesInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_legal_sources = /** @type {((inputs?: Invoicing_Legal_SourcesInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Legal_SourcesInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_legal_sources(inputs)
	return en_invoicing_legal_sources(inputs)
});