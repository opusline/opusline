/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_No_DayInputs */

const en_cra_no_day = /** @type {(inputs: Cra_No_DayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`no day`)
};

const fr_cra_no_day = /** @type {(inputs: Cra_No_DayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`aucune journée`)
};

/**
* | output |
* | --- |
* | "no day" |
*
* @param {Cra_No_DayInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_no_day = /** @type {((inputs?: Cra_No_DayInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_No_DayInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_no_day(inputs)
	return en_cra_no_day(inputs)
});