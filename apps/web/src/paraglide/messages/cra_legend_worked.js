/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Legend_WorkedInputs */

const en_cra_legend_worked = /** @type {(inputs: Cra_Legend_WorkedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Day reported`)
};

const fr_cra_legend_worked = /** @type {(inputs: Cra_Legend_WorkedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Journée saisie`)
};

/**
* | output |
* | --- |
* | "Day reported" |
*
* @param {Cra_Legend_WorkedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_legend_worked = /** @type {((inputs?: Cra_Legend_WorkedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Legend_WorkedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_legend_worked(inputs)
	return en_cra_legend_worked(inputs)
});