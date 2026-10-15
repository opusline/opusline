/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Declarations_Urssaf_KickerInputs */

const en_declarations_urssaf_kicker = /** @type {(inputs: Declarations_Urssaf_KickerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Collected revenue to declare`)
};

const fr_declarations_urssaf_kicker = /** @type {(inputs: Declarations_Urssaf_KickerInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`CA encaissé à déclarer`)
};

/**
* | output |
* | --- |
* | "Collected revenue to declare" |
*
* @param {Declarations_Urssaf_KickerInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const declarations_urssaf_kicker = /** @type {((inputs?: Declarations_Urssaf_KickerInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Declarations_Urssaf_KickerInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_declarations_urssaf_kicker(inputs)
	return en_declarations_urssaf_kicker(inputs)
});