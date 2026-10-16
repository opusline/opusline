/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Identity_TitleInputs */

const en_invoicing_identity_title = /** @type {(inputs: Invoicing_Identity_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Identity on documents`)
};

const fr_invoicing_identity_title = /** @type {(inputs: Invoicing_Identity_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Identité sur les documents`)
};

/**
* | output |
* | --- |
* | "Identity on documents" |
*
* @param {Invoicing_Identity_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_identity_title = /** @type {((inputs?: Invoicing_Identity_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Identity_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_identity_title(inputs)
	return en_invoicing_identity_title(inputs)
});