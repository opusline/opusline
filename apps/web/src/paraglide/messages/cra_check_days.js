/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Check_DaysInputs */

const en_cra_check_days = /** @type {(inputs: Cra_Check_DaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Days reported`)
};

const fr_cra_check_days = /** @type {(inputs: Cra_Check_DaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Jours saisis`)
};

/**
* | output |
* | --- |
* | "Days reported" |
*
* @param {Cra_Check_DaysInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_check_days = /** @type {((inputs?: Cra_Check_DaysInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Check_DaysInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_check_days(inputs)
	return en_cra_check_days(inputs)
});