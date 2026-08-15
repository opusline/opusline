/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ days: NonNullable<unknown> }} Cra_Reported_MatchingInputs */

const en_cra_reported_matching = /** @type {(inputs: Cra_Reported_MatchingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.days} — matches tracked time`)
};

const fr_cra_reported_matching = /** @type {(inputs: Cra_Reported_MatchingInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.days} — conforme au temps suivi`)
};

/**
* | output |
* | --- |
* | "{days} — matches tracked time" |
*
* @param {Cra_Reported_MatchingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_reported_matching = /** @type {((inputs: Cra_Reported_MatchingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Reported_MatchingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_reported_matching(inputs)
	return en_cra_reported_matching(inputs)
});