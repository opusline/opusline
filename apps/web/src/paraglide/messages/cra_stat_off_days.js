/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Stat_Off_DaysInputs */

const en_cra_stat_off_days = /** @type {(inputs: Cra_Stat_Off_DaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Non-working days worked`)
};

const fr_cra_stat_off_days = /** @type {(inputs: Cra_Stat_Off_DaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Non ouvrés travaillés`)
};

/**
* | output |
* | --- |
* | "Non-working days worked" |
*
* @param {Cra_Stat_Off_DaysInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_stat_off_days = /** @type {((inputs?: Cra_Stat_Off_DaysInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Stat_Off_DaysInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_stat_off_days(inputs)
	return en_cra_stat_off_days(inputs)
});