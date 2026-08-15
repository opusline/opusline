/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_WeekendInputs */

const en_cra_weekend = /** @type {(inputs: Cra_WeekendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`weekend`)
};

const fr_cra_weekend = /** @type {(inputs: Cra_WeekendInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`week-end`)
};

/**
* | output |
* | --- |
* | "weekend" |
*
* @param {Cra_WeekendInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_weekend = /** @type {((inputs?: Cra_WeekendInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_WeekendInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_weekend(inputs)
	return en_cra_weekend(inputs)
});