/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ difference: NonNullable<unknown> }} Cra_Days_DriftInputs */

const en_cra_days_drift = /** @type {(inputs: Cra_Days_DriftInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.difference} versus tracked time`)
};

const fr_cra_days_drift = /** @type {(inputs: Cra_Days_DriftInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.difference} par rapport au temps suivi`)
};

/**
* | output |
* | --- |
* | "{difference} versus tracked time" |
*
* @param {Cra_Days_DriftInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_days_drift = /** @type {((inputs: Cra_Days_DriftInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Days_DriftInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_days_drift(inputs)
	return en_cra_days_drift(inputs)
});