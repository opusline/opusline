/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Step_DaysInputs */

const en_cra_step_days = /** @type {(inputs: Cra_Step_DaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter the days`)
};

const fr_cra_step_days = /** @type {(inputs: Cra_Step_DaysInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Saisir les jours`)
};

/**
* | output |
* | --- |
* | "Enter the days" |
*
* @param {Cra_Step_DaysInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_step_days = /** @type {((inputs?: Cra_Step_DaysInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Step_DaysInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_step_days(inputs)
	return en_cra_step_days(inputs)
});