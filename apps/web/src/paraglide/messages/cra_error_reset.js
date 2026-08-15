/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Error_ResetInputs */

const en_cra_error_reset = /** @type {(inputs: Cra_Error_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The entries could not be restored.`)
};

const fr_cra_error_reset = /** @type {(inputs: Cra_Error_ResetInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les entrées n'ont pas pu être rétablies.`)
};

/**
* | output |
* | --- |
* | "The entries could not be restored." |
*
* @param {Cra_Error_ResetInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_error_reset = /** @type {((inputs?: Cra_Error_ResetInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Error_ResetInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_error_reset(inputs)
	return en_cra_error_reset(inputs)
});