/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Forfait_Load_FailedInputs */

const en_forfait_load_failed = /** @type {(inputs: Forfait_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The forfait progress could not be loaded. Try again in a moment.`)
};

const fr_forfait_load_failed = /** @type {(inputs: Forfait_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le suivi du forfait n'a pas pu être chargé. Réessayez dans un instant.`)
};

/**
* | output |
* | --- |
* | "The forfait progress could not be loaded. Try again in a moment." |
*
* @param {Forfait_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const forfait_load_failed = /** @type {((inputs?: Forfait_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Forfait_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_forfait_load_failed(inputs)
	return en_forfait_load_failed(inputs)
});