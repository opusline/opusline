/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Beta_Load_FailedInputs */

const en_beta_load_failed = /** @type {(inputs: Beta_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The early-access features could not be loaded.`)
};

const fr_beta_load_failed = /** @type {(inputs: Beta_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les fonctionnalités en avant-première n'ont pas pu être chargées.`)
};

/**
* | output |
* | --- |
* | "The early-access features could not be loaded." |
*
* @param {Beta_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const beta_load_failed = /** @type {((inputs?: Beta_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Beta_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_beta_load_failed(inputs)
	return en_beta_load_failed(inputs)
});