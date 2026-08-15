/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Error_DetailInputs */

const en_cra_error_detail = /** @type {(inputs: Cra_Error_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This activity report could not be loaded.`)
};

const fr_cra_error_detail = /** @type {(inputs: Cra_Error_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Ce compte rendu n'a pas pu être chargé.`)
};

/**
* | output |
* | --- |
* | "This activity report could not be loaded." |
*
* @param {Cra_Error_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_error_detail = /** @type {((inputs?: Cra_Error_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Error_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_error_detail(inputs)
	return en_cra_error_detail(inputs)
});