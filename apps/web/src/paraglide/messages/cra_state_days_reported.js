/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ days: NonNullable<unknown> }} Cra_State_Days_ReportedInputs */

const en_cra_state_days_reported = /** @type {(inputs: Cra_State_Days_ReportedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.days} reported`)
};

const fr_cra_state_days_reported = /** @type {(inputs: Cra_State_Days_ReportedInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.days} reportés`)
};

/**
* | output |
* | --- |
* | "{days} reported" |
*
* @param {Cra_State_Days_ReportedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_state_days_reported = /** @type {((inputs: Cra_State_Days_ReportedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_State_Days_ReportedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_state_days_reported(inputs)
	return en_cra_state_days_reported(inputs)
});