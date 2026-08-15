/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Steps_AriaInputs */

const en_cra_steps_aria = /** @type {(inputs: Cra_Steps_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Steps of the activity report`)
};

const fr_cra_steps_aria = /** @type {(inputs: Cra_Steps_AriaInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Étapes du compte rendu`)
};

/**
* | output |
* | --- |
* | "Steps of the activity report" |
*
* @param {Cra_Steps_AriaInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_steps_aria = /** @type {((inputs?: Cra_Steps_AriaInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Steps_AriaInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_steps_aria(inputs)
	return en_cra_steps_aria(inputs)
});