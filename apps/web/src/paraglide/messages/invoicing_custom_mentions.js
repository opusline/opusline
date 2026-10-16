/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Custom_MentionsInputs */

const en_invoicing_custom_mentions = /** @type {(inputs: Invoicing_Custom_MentionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Custom mentions`)
};

const fr_invoicing_custom_mentions = /** @type {(inputs: Invoicing_Custom_MentionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mentions personnalisées`)
};

/**
* | output |
* | --- |
* | "Custom mentions" |
*
* @param {Invoicing_Custom_MentionsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_custom_mentions = /** @type {((inputs?: Invoicing_Custom_MentionsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Custom_MentionsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_custom_mentions(inputs)
	return en_invoicing_custom_mentions(inputs)
});