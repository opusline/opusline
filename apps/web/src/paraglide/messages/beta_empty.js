/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Beta_EmptyInputs */

const en_beta_empty = /** @type {(inputs: Beta_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`This instance offers no early-access feature at the moment.`)
};

const fr_beta_empty = /** @type {(inputs: Beta_EmptyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cette instance ne propose aucune fonctionnalité en avant-première pour le moment.`)
};

/**
* | output |
* | --- |
* | "This instance offers no early-access feature at the moment." |
*
* @param {Beta_EmptyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const beta_empty = /** @type {((inputs?: Beta_EmptyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Beta_EmptyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_beta_empty(inputs)
	return en_beta_empty(inputs)
});