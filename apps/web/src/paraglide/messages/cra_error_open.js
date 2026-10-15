/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Error_OpenInputs */

const en_cra_error_open = /** @type {(inputs: Cra_Error_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The CRA could not be opened.`)
};

const fr_cra_error_open = /** @type {(inputs: Cra_Error_OpenInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le CRA n'a pas pu être ouvert.`)
};

/**
* | output |
* | --- |
* | "The CRA could not be opened." |
*
* @param {Cra_Error_OpenInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_error_open = /** @type {((inputs?: Cra_Error_OpenInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Error_OpenInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_error_open(inputs)
	return en_cra_error_open(inputs)
});