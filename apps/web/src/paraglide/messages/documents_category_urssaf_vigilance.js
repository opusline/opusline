/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Category_Urssaf_VigilanceInputs */

const en_documents_category_urssaf_vigilance = /** @type {(inputs: Documents_Category_Urssaf_VigilanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`URSSAF attestation`)
};

const fr_documents_category_urssaf_vigilance = /** @type {(inputs: Documents_Category_Urssaf_VigilanceInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Attestation URSSAF`)
};

/**
* | output |
* | --- |
* | "URSSAF attestation" |
*
* @param {Documents_Category_Urssaf_VigilanceInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_category_urssaf_vigilance = /** @type {((inputs?: Documents_Category_Urssaf_VigilanceInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Category_Urssaf_VigilanceInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_category_urssaf_vigilance(inputs)
	return en_documents_category_urssaf_vigilance(inputs)
});