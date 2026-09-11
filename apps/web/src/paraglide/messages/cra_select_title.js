/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Select_TitleInputs */

const en_cra_select_title = /** @type {(inputs: Cra_Select_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Pick a month on the left`)
};

const fr_cra_select_title = /** @type {(inputs: Cra_Select_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Choisissez un mois à gauche`)
};

/**
* | output |
* | --- |
* | "Pick a month on the left" |
*
* @param {Cra_Select_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_select_title = /** @type {((inputs?: Cra_Select_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Select_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_select_title(inputs)
	return en_cra_select_title(inputs)
});