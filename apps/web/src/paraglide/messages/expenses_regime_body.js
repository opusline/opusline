/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ charges: NonNullable<unknown>, revenue: NonNullable<unknown>, allowance: NonNullable<unknown> }} Expenses_Regime_BodyInputs */

const en_expenses_regime_body = /** @type {(inputs: Expenses_Regime_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Your projected real charges (${i?.charges}, subscriptions included) compare with the flat 34 % allowance on ${i?.revenue} of revenue. The real regime only pays off above ${i?.allowance} of deductible charges.`)
};

const fr_expenses_regime_body = /** @type {(inputs: Expenses_Regime_BodyInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Vos charges réelles projetées (${i?.charges}, abonnements inclus) se comparent à l'abattement forfaitaire de 34 % sur ${i?.revenue} de CA. Le réel ne devient intéressant qu'au-delà de ${i?.allowance} de charges déductibles.`)
};

/**
* | output |
* | --- |
* | "Your projected real charges ({charges}, subscriptions included) compare with the flat 34 % allowance on {revenue} of revenue. The real regime only pays off a..." |
*
* @param {Expenses_Regime_BodyInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_regime_body = /** @type {((inputs: Expenses_Regime_BodyInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Regime_BodyInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_regime_body(inputs)
	return en_expenses_regime_body(inputs)
});