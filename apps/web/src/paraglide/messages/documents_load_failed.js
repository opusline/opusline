/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Load_FailedInputs */

const en_documents_load_failed = /** @type {(inputs: Documents_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The documents could not be loaded. Try again in a moment.`)
};

const fr_documents_load_failed = /** @type {(inputs: Documents_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Impossible de charger les documents. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "The documents could not be loaded. Try again in a moment." |
*
* @param {Documents_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_load_failed = /** @type {((inputs?: Documents_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_load_failed(inputs)
	return en_documents_load_failed(inputs)
});