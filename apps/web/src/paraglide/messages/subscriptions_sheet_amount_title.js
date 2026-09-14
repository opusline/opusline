/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ supplier: NonNullable<unknown> }} Subscriptions_Sheet_Amount_TitleInputs */

const en_subscriptions_sheet_amount_title = /** @type {(inputs: Subscriptions_Sheet_Amount_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Change the amount · ${i?.supplier}`)
};

const fr_subscriptions_sheet_amount_title = /** @type {(inputs: Subscriptions_Sheet_Amount_TitleInputs) => LocalizedString} */ (i) => {
	return /** @type {LocalizedString} */ (`Changer le montant · ${i?.supplier}`)
};

/**
* | output |
* | --- |
* | "Change the amount · {supplier}" |
*
* @param {Subscriptions_Sheet_Amount_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_sheet_amount_title = /** @type {((inputs: Subscriptions_Sheet_Amount_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Sheet_Amount_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_sheet_amount_title(inputs)
	return en_subscriptions_sheet_amount_title(inputs)
});