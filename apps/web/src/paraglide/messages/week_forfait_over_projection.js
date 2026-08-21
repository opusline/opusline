/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ share: NonNullable<unknown>, tracked: NonNullable<unknown>, over: NonNullable<unknown> }} Week_Forfait_Over_ProjectionInputs */

const en_week_forfait_over_projection = /** @type {(inputs: Week_Forfait_Over_ProjectionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Fixed price ${i?.share} % consumed · ${i?.tracked} tracked, already ${i?.over} beyond the fixed price.`)
};

const fr_week_forfait_over_projection = /** @type {(inputs: Week_Forfait_Over_ProjectionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Forfait consommé à ${i?.share} % · ${i?.tracked} saisis, déjà ${i?.over} au-delà du forfait.`)
};

/**
* | output |
* | --- |
* | "Fixed price {share} % consumed · {tracked} tracked, already {over} beyond the fixed price." |
*
* @param {Week_Forfait_Over_ProjectionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_forfait_over_projection = /** @type {((inputs: Week_Forfait_Over_ProjectionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Forfait_Over_ProjectionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_forfait_over_projection(inputs)
	return en_week_forfait_over_projection(inputs)
});