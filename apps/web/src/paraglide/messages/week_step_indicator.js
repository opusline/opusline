/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ step: NonNullable<unknown> }} Week_Step_IndicatorInputs */

const en_week_step_indicator = /** @type {(inputs: Week_Step_IndicatorInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Step ${i?.step} of 2`)
};

const fr_week_step_indicator = /** @type {(inputs: Week_Step_IndicatorInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Étape ${i?.step} sur 2`)
};

/**
* | output |
* | --- |
* | "Step {step} of 2" |
*
* @param {Week_Step_IndicatorInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_step_indicator = /** @type {((inputs: Week_Step_IndicatorInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Step_IndicatorInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_step_indicator(inputs)
	return en_week_step_indicator(inputs)
});