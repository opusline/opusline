/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_State_Nothing_To_ReportInputs */

const en_cra_state_nothing_to_report = /** @type {(inputs: Cra_State_Nothing_To_ReportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Nothing to report`)
};

const fr_cra_state_nothing_to_report = /** @type {(inputs: Cra_State_Nothing_To_ReportInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Rien à signaler`)
};

/**
* | output |
* | --- |
* | "Nothing to report" |
*
* @param {Cra_State_Nothing_To_ReportInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_state_nothing_to_report = /** @type {((inputs?: Cra_State_Nothing_To_ReportInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_State_Nothing_To_ReportInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_state_nothing_to_report(inputs)
	return en_cra_state_nothing_to_report(inputs)
});