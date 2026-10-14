/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Mentions_TitleInputs */

const en_invoicing_mentions_title = /** @type {(inputs: Invoicing_Mentions_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mentions on documents`)
};

const fr_invoicing_mentions_title = /** @type {(inputs: Invoicing_Mentions_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mentions sur le document`)
};

/**
* | output |
* | --- |
* | "Mentions on documents" |
*
* @param {Invoicing_Mentions_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_mentions_title = /** @type {((inputs?: Invoicing_Mentions_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Mentions_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_mentions_title(inputs)
	return en_invoicing_mentions_title(inputs)
});