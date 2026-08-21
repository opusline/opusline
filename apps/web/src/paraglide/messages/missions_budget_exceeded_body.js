/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ tracked: NonNullable<unknown>, rate: NonNullable<unknown>, consumed: NonNullable<unknown>, forfait: NonNullable<unknown>, over: NonNullable<unknown> }} Missions_Budget_Exceeded_BodyInputs */

const en_missions_budget_exceeded_body = /** @type {(inputs: Missions_Budget_Exceeded_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.tracked} tracked at ${i?.rate} come to ${i?.consumed}, against a fixed price of ${i?.forfait}. The ${i?.over} beyond are on you: price an avenant, or stop production.`)
};

const fr_missions_budget_exceeded_body = /** @type {(inputs: Missions_Budget_Exceeded_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`${i?.tracked} saisis valorisés à ${i?.rate} font ${i?.consumed}, pour un forfait de ${i?.forfait}. Les ${i?.over} au-delà sont à votre charge : chiffrez un avenant ou arrêtez la production.`)
};

/**
* | output |
* | --- |
* | "{tracked} tracked at {rate} come to {consumed}, against a fixed price of {forfait}. The {over} beyond are on you: price an avenant, or stop production." |
*
* @param {Missions_Budget_Exceeded_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const missions_budget_exceeded_body = /** @type {((inputs: Missions_Budget_Exceeded_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Missions_Budget_Exceeded_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_missions_budget_exceeded_body(inputs)
	return en_missions_budget_exceeded_body(inputs)
});