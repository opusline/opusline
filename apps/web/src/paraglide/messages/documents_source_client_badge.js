/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Source_Client_BadgeInputs */

const en_documents_source_client_badge = /** @type {(inputs: Documents_Source_Client_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`client`)
};

const fr_documents_source_client_badge = /** @type {(inputs: Documents_Source_Client_BadgeInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`client`)
};

/**
* | output |
* | --- |
* | "client" |
*
* @param {Documents_Source_Client_BadgeInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_source_client_badge = /** @type {((inputs?: Documents_Source_Client_BadgeInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Source_Client_BadgeInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_source_client_badge(inputs)
	return en_documents_source_client_badge(inputs)
});