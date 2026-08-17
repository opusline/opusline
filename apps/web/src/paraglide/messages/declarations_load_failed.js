/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Load_FailedInputs */

const en_declarations_load_failed = /** @type {(inputs: Declarations_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Could not load your declarations.`)
};

const fr_declarations_load_failed = /** @type {(inputs: Declarations_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Impossible de charger vos déclarations.`)
};

/**
* | output |
* | --- |
* | "Could not load your declarations." |
*
* @param {Declarations_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_load_failed = /** @type {((inputs?: Declarations_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_load_failed(inputs)
	return en_declarations_load_failed(inputs)
});