/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Hint_DocumentInputs */

const en_cra_hint_document = /** @type {(inputs: Cra_Hint_DocumentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The document goes out as is`)
};

const fr_cra_hint_document = /** @type {(inputs: Cra_Hint_DocumentInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le document part tel quel`)
};

/**
* | output |
* | --- |
* | "The document goes out as is" |
*
* @param {Cra_Hint_DocumentInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_hint_document = /** @type {((inputs?: Cra_Hint_DocumentInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Hint_DocumentInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_hint_document(inputs)
	return en_cra_hint_document(inputs)
});