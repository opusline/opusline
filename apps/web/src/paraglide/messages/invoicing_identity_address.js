/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Identity_AddressInputs */

const en_invoicing_identity_address = /** @type {(inputs: Invoicing_Identity_AddressInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Address`)
};

const fr_invoicing_identity_address = /** @type {(inputs: Invoicing_Identity_AddressInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Adresse`)
};

/**
* | output |
* | --- |
* | "Address" |
*
* @param {Invoicing_Identity_AddressInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_identity_address = /** @type {((inputs?: Invoicing_Identity_AddressInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Identity_AddressInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_identity_address(inputs)
	return en_invoicing_identity_address(inputs)
});