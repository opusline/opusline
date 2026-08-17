/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ amount: NonNullable<unknown>, price: NonNullable<unknown> }} Forfait_Over_Billed_BodyInputs */

const en_forfait_over_billed_body = /** @type {(inputs: Forfait_Over_Billed_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} more than the ${i?.price} agreed. Raise the mission's price if the scope grew.`)
};

const fr_forfait_over_billed_body = /** @type {(inputs: Forfait_Over_Billed_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.amount} de plus que les ${i?.price} convenus. Augmentez le prix de la mission si le périmètre a grandi.`)
};

/**
* | output |
* | --- |
* | "{amount} more than the {price} agreed. Raise the mission's price if the scope grew." |
*
* @param {Forfait_Over_Billed_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const forfait_over_billed_body = /** @type {((inputs: Forfait_Over_Billed_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Forfait_Over_Billed_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_forfait_over_billed_body(inputs)
	return en_forfait_over_billed_body(inputs)
});