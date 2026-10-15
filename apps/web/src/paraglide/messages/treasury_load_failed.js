/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Load_FailedInputs */

const en_treasury_load_failed = /** @type {(inputs: Treasury_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The transferable amount could not be loaded.`)
};

const fr_treasury_load_failed = /** @type {(inputs: Treasury_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le montant virable n'a pas pu être chargé.`)
};

/**
* | output |
* | --- |
* | "The transferable amount could not be loaded." |
*
* @param {Treasury_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_load_failed = /** @type {((inputs?: Treasury_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_load_failed(inputs)
	return en_treasury_load_failed(inputs)
});