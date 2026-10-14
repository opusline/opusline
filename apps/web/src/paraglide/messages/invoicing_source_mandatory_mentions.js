/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Source_Mandatory_MentionsInputs */

const en_invoicing_source_mandatory_mentions = /** @type {(inputs: Invoicing_Source_Mandatory_MentionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mandatory mentions on quotes and invoices · Shine help`)
};

const fr_invoicing_source_mandatory_mentions = /** @type {(inputs: Invoicing_Source_Mandatory_MentionsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mentions obligatoires des devis et factures · aide Shine`)
};

/**
* | output |
* | --- |
* | "Mandatory mentions on quotes and invoices · Shine help" |
*
* @param {Invoicing_Source_Mandatory_MentionsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_source_mandatory_mentions = /** @type {((inputs?: Invoicing_Source_Mandatory_MentionsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Source_Mandatory_MentionsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_source_mandatory_mentions(inputs)
	return en_invoicing_source_mandatory_mentions(inputs)
});