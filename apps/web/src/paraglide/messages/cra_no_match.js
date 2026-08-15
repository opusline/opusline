/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_No_MatchInputs */

const en_cra_no_match = /** @type {(inputs: Cra_No_MatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No CRA matches`)
};

const fr_cra_no_match = /** @type {(inputs: Cra_No_MatchInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucun CRA ne correspond`)
};

/**
* | output |
* | --- |
* | "No CRA matches" |
*
* @param {Cra_No_MatchInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_no_match = /** @type {((inputs?: Cra_No_MatchInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_No_MatchInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_no_match(inputs)
	return en_cra_no_match(inputs)
});