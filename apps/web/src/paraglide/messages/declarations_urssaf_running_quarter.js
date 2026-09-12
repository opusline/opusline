/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Urssaf_Running_QuarterInputs */

const en_declarations_urssaf_running_quarter = /** @type {(inputs: Declarations_Urssaf_Running_QuarterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The running quarter is filed once it ends; this is the previous one.`)
};

const fr_declarations_urssaf_running_quarter = /** @type {(inputs: Declarations_Urssaf_Running_QuarterInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Le trimestre en cours se déclare à sa fin ; voici le précédent.`)
};

/**
* | output |
* | --- |
* | "The running quarter is filed once it ends; this is the previous one." |
*
* @param {Declarations_Urssaf_Running_QuarterInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_urssaf_running_quarter = /** @type {((inputs?: Declarations_Urssaf_Running_QuarterInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Urssaf_Running_QuarterInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_urssaf_running_quarter(inputs)
	return en_declarations_urssaf_running_quarter(inputs)
});