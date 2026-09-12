/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Field_Amount_HtInputs */

const en_subscriptions_field_amount_ht = /** @type {(inputs: Subscriptions_Field_Amount_HtInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`HT amount`)
};

const fr_subscriptions_field_amount_ht = /** @type {(inputs: Subscriptions_Field_Amount_HtInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Montant HT`)
};

/**
* | output |
* | --- |
* | "HT amount" |
*
* @param {Subscriptions_Field_Amount_HtInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_field_amount_ht = /** @type {((inputs?: Subscriptions_Field_Amount_HtInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Field_Amount_HtInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_field_amount_ht(inputs)
	return en_subscriptions_field_amount_ht(inputs)
});