/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Grid_AriaInputs */

const en_cra_grid_aria = /** @type {(inputs: Cra_Grid_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Days of the month`)
};

const fr_cra_grid_aria = /** @type {(inputs: Cra_Grid_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Jours du mois`)
};

/**
* | output |
* | --- |
* | "Days of the month" |
*
* @param {Cra_Grid_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_grid_aria = /** @type {((inputs?: Cra_Grid_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Grid_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_grid_aria(inputs)
	return en_cra_grid_aria(inputs)
});