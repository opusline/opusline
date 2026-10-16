/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Invoicing_Identity_EditInputs */

const en_invoicing_identity_edit = /** @type {(inputs: Invoicing_Identity_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Edit in Settings`)
};

const fr_invoicing_identity_edit = /** @type {(inputs: Invoicing_Identity_EditInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modifier dans Réglages`)
};

/**
* | output |
* | --- |
* | "Edit in Settings" |
*
* @param {Invoicing_Identity_EditInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_identity_edit = /** @type {((inputs?: Invoicing_Identity_EditInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_Identity_EditInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_identity_edit(inputs)
	return en_invoicing_identity_edit(inputs)
});