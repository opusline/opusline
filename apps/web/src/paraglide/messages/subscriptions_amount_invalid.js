/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Amount_InvalidInputs */

const en_subscriptions_amount_invalid = /** @type {(inputs: Subscriptions_Amount_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Enter an HT amount above zero.`)
};

const fr_subscriptions_amount_invalid = /** @type {(inputs: Subscriptions_Amount_InvalidInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Indiquez un montant HT supérieur à zéro.`)
};

/**
* | output |
* | --- |
* | "Enter an HT amount above zero." |
*
* @param {Subscriptions_Amount_InvalidInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_amount_invalid = /** @type {((inputs?: Subscriptions_Amount_InvalidInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Amount_InvalidInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_amount_invalid(inputs)
	return en_subscriptions_amount_invalid(inputs)
});