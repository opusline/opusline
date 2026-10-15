/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Category_CertificateInputs */

const en_documents_category_certificate = /** @type {(inputs: Documents_Category_CertificateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Certificate`)
};

const fr_documents_category_certificate = /** @type {(inputs: Documents_Category_CertificateInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Attestation`)
};

/**
* | output |
* | --- |
* | "Certificate" |
*
* @param {Documents_Category_CertificateInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_category_certificate = /** @type {((inputs?: Documents_Category_CertificateInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Category_CertificateInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_category_certificate(inputs)
	return en_documents_category_certificate(inputs)
});