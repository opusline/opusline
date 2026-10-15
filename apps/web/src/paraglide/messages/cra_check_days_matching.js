/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Check_Days_MatchingInputs */

const en_cra_check_days_matching = /** @type {(inputs: Cra_Check_Days_MatchingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`matches the time tracked this month`)
};

const fr_cra_check_days_matching = /** @type {(inputs: Cra_Check_Days_MatchingInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`conforme au temps suivi ce mois`)
};

/**
* | output |
* | --- |
* | "matches the time tracked this month" |
*
* @param {Cra_Check_Days_MatchingInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_check_days_matching = /** @type {((inputs?: Cra_Check_Days_MatchingInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Check_Days_MatchingInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_check_days_matching(inputs)
	return en_cra_check_days_matching(inputs)
});