/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Beta_Feature_Invoicing_TitleInputs */

const en_beta_feature_invoicing_title = /** @type {(inputs: Beta_Feature_Invoicing_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Invoicing in Opusline`)
};

const fr_beta_feature_invoicing_title = /** @type {(inputs: Beta_Feature_Invoicing_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facturation dans Opusline`)
};

/**
* | output |
* | --- |
* | "Invoicing in Opusline" |
*
* @param {Beta_Feature_Invoicing_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const beta_feature_invoicing_title = /** @type {((inputs?: Beta_Feature_Invoicing_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Beta_Feature_Invoicing_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_beta_feature_invoicing_title(inputs)
	return en_beta_feature_invoicing_title(inputs)
});