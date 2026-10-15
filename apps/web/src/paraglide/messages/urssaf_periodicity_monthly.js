/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Urssaf_Periodicity_MonthlyInputs */

const en_urssaf_periodicity_monthly = /** @type {(inputs: Urssaf_Periodicity_MonthlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Monthly`)
};

const fr_urssaf_periodicity_monthly = /** @type {(inputs: Urssaf_Periodicity_MonthlyInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Mensuelle`)
};

/**
* | output |
* | --- |
* | "Monthly" |
*
* @param {Urssaf_Periodicity_MonthlyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const urssaf_periodicity_monthly = /** @type {((inputs?: Urssaf_Periodicity_MonthlyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Urssaf_Periodicity_MonthlyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_urssaf_periodicity_monthly(inputs)
	return en_urssaf_periodicity_monthly(inputs)
});