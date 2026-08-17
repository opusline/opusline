/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Treasury_Short_TitleInputs */

const en_treasury_short_title = /** @type {(inputs: Treasury_Short_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The account is below what it owes`)
};

const fr_treasury_short_title = /** @type {(inputs: Treasury_Short_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le compte est en dessous de ce qu'il doit`)
};

/**
* | output |
* | --- |
* | "The account is below what it owes" |
*
* @param {Treasury_Short_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const treasury_short_title = /** @type {((inputs?: Treasury_Short_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Treasury_Short_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_treasury_short_title(inputs)
	return en_treasury_short_title(inputs)
});