/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ reported: NonNullable<unknown>, tracked: NonNullable<unknown> }} Cra_Reported_AgainstInputs */

const en_cra_reported_against = /** @type {(inputs: Cra_Reported_AgainstInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.reported} reported · ${i?.tracked} tracked`)
};

const fr_cra_reported_against = /** @type {(inputs: Cra_Reported_AgainstInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.reported} saisis · ${i?.tracked} suivis`)
};

/**
* | output |
* | --- |
* | "{reported} reported · {tracked} tracked" |
*
* @param {Cra_Reported_AgainstInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_reported_against = /** @type {((inputs: Cra_Reported_AgainstInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Reported_AgainstInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_reported_against(inputs)
	return en_cra_reported_against(inputs)
});