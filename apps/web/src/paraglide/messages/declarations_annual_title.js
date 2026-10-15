/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Annual_TitleInputs */

const en_declarations_annual_title = /** @type {(inputs: Declarations_Annual_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Yearly`)
};

const fr_declarations_annual_title = /** @type {(inputs: Declarations_Annual_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Annuel`)
};

/**
* | output |
* | --- |
* | "Yearly" |
*
* @param {Declarations_Annual_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_annual_title = /** @type {((inputs?: Declarations_Annual_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Annual_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_annual_title(inputs)
	return en_declarations_annual_title(inputs)
});