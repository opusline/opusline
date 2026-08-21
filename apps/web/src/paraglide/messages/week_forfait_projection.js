/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ entry: NonNullable<unknown>, share: NonNullable<unknown>, consumed: NonNullable<unknown>, forfait: NonNullable<unknown> }} Week_Forfait_ProjectionInputs */

const en_week_forfait_projection = /** @type {(inputs: Week_Forfait_ProjectionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`This ${i?.entry} entry takes the fixed price to ${i?.share} % consumed — ${i?.consumed} of ${i?.forfait}.`)
};

const fr_week_forfait_projection = /** @type {(inputs: Week_Forfait_ProjectionInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Cette entrée de ${i?.entry} porte le consommé à ${i?.share} % du forfait — ${i?.consumed} sur ${i?.forfait}.`)
};

/**
* | output |
* | --- |
* | "This {entry} entry takes the fixed price to {share} % consumed — {consumed} of {forfait}." |
*
* @param {Week_Forfait_ProjectionInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const week_forfait_projection = /** @type {((inputs: Week_Forfait_ProjectionInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Week_Forfait_ProjectionInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_week_forfait_projection(inputs)
	return en_week_forfait_projection(inputs)
});