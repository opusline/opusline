/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_PlaceholderInputs */

const en_declarations_placeholder = /** @type {(inputs: Declarations_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Filing helpers land here — URSSAF and VAT, figures ready to copy.`)
};

const fr_declarations_placeholder = /** @type {(inputs: Declarations_PlaceholderInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les aides à la déclaration arrivent ici — URSSAF et TVA, chiffres prêts à copier.`)
};

/**
* | output |
* | --- |
* | "Filing helpers land here — URSSAF and VAT, figures ready to copy." |
*
* @param {Declarations_PlaceholderInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_placeholder = /** @type {((inputs?: Declarations_PlaceholderInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_PlaceholderInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_placeholder(inputs)
	return en_declarations_placeholder(inputs)
});