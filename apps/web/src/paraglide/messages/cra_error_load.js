/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Error_LoadInputs */

const en_cra_error_load = /** @type {(inputs: Cra_Error_LoadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The activity reports could not be loaded. Try again in a moment.`)
};

const fr_cra_error_load = /** @type {(inputs: Cra_Error_LoadInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Impossible de charger les comptes rendus. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "The activity reports could not be loaded. Try again in a moment." |
*
* @param {Cra_Error_LoadInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_error_load = /** @type {((inputs?: Cra_Error_LoadInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Error_LoadInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_error_load(inputs)
	return en_cra_error_load(inputs)
});