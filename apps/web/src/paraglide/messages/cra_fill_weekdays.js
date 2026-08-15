/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Fill_WeekdaysInputs */

const en_cra_fill_weekdays = /** @type {(inputs: Cra_Fill_WeekdaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Fill the working days`)
};

const fr_cra_fill_weekdays = /** @type {(inputs: Cra_Fill_WeekdaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Remplir les jours ouvrés`)
};

/**
* | output |
* | --- |
* | "Fill the working days" |
*
* @param {Cra_Fill_WeekdaysInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_fill_weekdays = /** @type {((inputs?: Cra_Fill_WeekdaysInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Fill_WeekdaysInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_fill_weekdays(inputs)
	return en_cra_fill_weekdays(inputs)
});