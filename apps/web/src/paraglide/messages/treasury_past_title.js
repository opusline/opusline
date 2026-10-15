/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Past_TitleInputs */

const en_treasury_past_title = /** @type {(inputs: Treasury_Past_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Past transfers`)
};

const fr_treasury_past_title = /** @type {(inputs: Treasury_Past_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Virements passés`)
};

/**
* | output |
* | --- |
* | "Past transfers" |
*
* @param {Treasury_Past_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_past_title = /** @type {((inputs?: Treasury_Past_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Past_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_past_title(inputs)
	return en_treasury_past_title(inputs)
});