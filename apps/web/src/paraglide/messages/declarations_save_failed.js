/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Save_FailedInputs */

const en_declarations_save_failed = /** @type {(inputs: Declarations_Save_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Could not record the filing.`)
};

const fr_declarations_save_failed = /** @type {(inputs: Declarations_Save_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Impossible d'enregistrer la déclaration.`)
};

/**
* | output |
* | --- |
* | "Could not record the filing." |
*
* @param {Declarations_Save_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_save_failed = /** @type {((inputs?: Declarations_Save_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Save_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_save_failed(inputs)
	return en_declarations_save_failed(inputs)
});