/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ year: NonNullable<unknown> }} Declarations_Cfe_Sheet_TitleInputs */

const en_declarations_cfe_sheet_title = /** @type {(inputs: Declarations_Cfe_Sheet_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`CFE ${i?.year}`)
};

const fr_declarations_cfe_sheet_title = /** @type {(inputs: Declarations_Cfe_Sheet_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`CFE ${i?.year}`)
};

/**
* | output |
* | --- |
* | "CFE {year}" |
*
* @param {Declarations_Cfe_Sheet_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_cfe_sheet_title = /** @type {((inputs: Declarations_Cfe_Sheet_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Cfe_Sheet_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_cfe_sheet_title(inputs)
	return en_declarations_cfe_sheet_title(inputs)
});