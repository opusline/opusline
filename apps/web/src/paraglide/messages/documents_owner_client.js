/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Documents_Owner_ClientInputs */

const en_documents_owner_client = /** @type {(inputs: Documents_Owner_ClientInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`client`)
};

const fr_documents_owner_client = /** @type {(inputs: Documents_Owner_ClientInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`client`)
};

/**
* | output |
* | --- |
* | "client" |
*
* @param {Documents_Owner_ClientInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const documents_owner_client = /** @type {((inputs?: Documents_Owner_ClientInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Documents_Owner_ClientInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_documents_owner_client(inputs)
	return en_documents_owner_client(inputs)
});