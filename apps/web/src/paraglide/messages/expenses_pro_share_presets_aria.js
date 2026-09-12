/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Expenses_Pro_Share_Presets_AriaInputs */

const en_expenses_pro_share_presets_aria = /** @type {(inputs: Expenses_Pro_Share_Presets_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Usual shares`)
};

const fr_expenses_pro_share_presets_aria = /** @type {(inputs: Expenses_Pro_Share_Presets_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Parts habituelles`)
};

/**
* | output |
* | --- |
* | "Usual shares" |
*
* @param {Expenses_Pro_Share_Presets_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_pro_share_presets_aria = /** @type {((inputs?: Expenses_Pro_Share_Presets_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Pro_Share_Presets_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_pro_share_presets_aria(inputs)
	return en_expenses_pro_share_presets_aria(inputs)
});