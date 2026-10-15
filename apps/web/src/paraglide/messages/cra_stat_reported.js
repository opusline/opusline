/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Stat_ReportedInputs */

const en_cra_stat_reported = /** @type {(inputs: Cra_Stat_ReportedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Days reported`)
};

const fr_cra_stat_reported = /** @type {(inputs: Cra_Stat_ReportedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Jours reportés`)
};

/**
* | output |
* | --- |
* | "Days reported" |
*
* @param {Cra_Stat_ReportedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_stat_reported = /** @type {((inputs?: Cra_Stat_ReportedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Stat_ReportedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_stat_reported(inputs)
	return en_cra_stat_reported(inputs)
});