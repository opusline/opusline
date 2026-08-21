/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Empty_TitleInputs */

const en_treasury_empty_title = /** @type {(inputs: Treasury_Empty_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No business account balance yet`)
};

const fr_treasury_empty_title = /** @type {(inputs: Treasury_Empty_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pas encore de solde du compte pro`)
};

/**
* | output |
* | --- |
* | "No business account balance yet" |
*
* @param {Treasury_Empty_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_empty_title = /** @type {((inputs?: Treasury_Empty_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Empty_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_empty_title(inputs)
	return en_treasury_empty_title(inputs)
});