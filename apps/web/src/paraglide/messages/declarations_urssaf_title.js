/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ period: NonNullable<unknown> }} Declarations_Urssaf_TitleInputs */

const en_declarations_urssaf_title = /** @type {(inputs: Declarations_Urssaf_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`URSSAF · ${i?.period}`)
};

const fr_declarations_urssaf_title = /** @type {(inputs: Declarations_Urssaf_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`URSSAF · ${i?.period}`)
};

/**
* | output |
* | --- |
* | "URSSAF · {period}" |
*
* @param {Declarations_Urssaf_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_urssaf_title = /** @type {((inputs: Declarations_Urssaf_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Urssaf_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_urssaf_title(inputs)
	return en_declarations_urssaf_title(inputs)
});