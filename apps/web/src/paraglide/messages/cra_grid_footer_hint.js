/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Grid_Footer_HintInputs */

const en_cra_grid_footer_hint = /** @type {(inputs: Cra_Grid_Footer_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Click the days worked`)
};

const fr_cra_grid_footer_hint = /** @type {(inputs: Cra_Grid_Footer_HintInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Cliquez les jours travaillés`)
};

/**
* | output |
* | --- |
* | "Click the days worked" |
*
* @param {Cra_Grid_Footer_HintInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_grid_footer_hint = /** @type {((inputs?: Cra_Grid_Footer_HintInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Grid_Footer_HintInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_grid_footer_hint(inputs)
	return en_cra_grid_footer_hint(inputs)
});