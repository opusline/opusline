/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Empty_TitleInputs */

const en_cra_empty_title = /** @type {(inputs: Cra_Empty_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No mission requires a CRA`)
};

const fr_cra_empty_title = /** @type {(inputs: Cra_Empty_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucune mission ne demande de CRA`)
};

/**
* | output |
* | --- |
* | "No mission requires a CRA" |
*
* @param {Cra_Empty_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_empty_title = /** @type {((inputs?: Cra_Empty_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Empty_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_empty_title(inputs)
	return en_cra_empty_title(inputs)
});