/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Identity_NameInputs */

const en_invoicing_identity_name = /** @type {(inputs: Invoicing_Identity_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Business name`)
};

const fr_invoicing_identity_name = /** @type {(inputs: Invoicing_Identity_NameInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Raison sociale`)
};

/**
* | output |
* | --- |
* | "Business name" |
*
* @param {Invoicing_Identity_NameInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_identity_name = /** @type {((inputs?: Invoicing_Identity_NameInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Identity_NameInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_identity_name(inputs)
	return en_invoicing_identity_name(inputs)
});