/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Nav_DeclarationsInputs */

const en_nav_declarations = /** @type {(inputs: Nav_DeclarationsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Filings`)
};

const fr_nav_declarations = /** @type {(inputs: Nav_DeclarationsInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Déclarations`)
};

/**
* | output |
* | --- |
* | "Filings" |
*
* @param {Nav_DeclarationsInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const nav_declarations = /** @type {((inputs?: Nav_DeclarationsInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Nav_DeclarationsInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_nav_declarations(inputs)
	return en_nav_declarations(inputs)
});