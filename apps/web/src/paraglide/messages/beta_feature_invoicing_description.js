/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Beta_Feature_Invoicing_DescriptionInputs */

const en_beta_feature_invoicing_description = /** @type {(inputs: Beta_Feature_Invoicing_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Write, number and issue your invoices from Opusline, with a service catalogue, a live preview and the PDF.`)
};

const fr_beta_feature_invoicing_description = /** @type {(inputs: Beta_Feature_Invoicing_DescriptionInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rédigez, numérotez et émettez vos factures depuis Opusline, avec un catalogue de prestations, un aperçu en direct et le PDF.`)
};

/**
* | output |
* | --- |
* | "Write, number and issue your invoices from Opusline, with a service catalogue, a live preview and the PDF." |
*
* @param {Beta_Feature_Invoicing_DescriptionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const beta_feature_invoicing_description = /** @type {((inputs?: Beta_Feature_Invoicing_DescriptionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Beta_Feature_Invoicing_DescriptionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_beta_feature_invoicing_description(inputs)
	return en_beta_feature_invoicing_description(inputs)
});