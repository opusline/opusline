/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Beta_TitleInputs */

const en_beta_title = /** @type {(inputs: Beta_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Early-access features`)
};

const fr_beta_title = /** @type {(inputs: Beta_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fonctionnalités en avant-première`)
};

/**
* | output |
* | --- |
* | "Early-access features" |
*
* @param {Beta_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const beta_title = /** @type {((inputs?: Beta_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Beta_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_beta_title(inputs)
	return en_beta_title(inputs)
});