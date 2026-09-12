/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Subscriptions_Sheet_Edit_TitleInputs */

const en_subscriptions_sheet_edit_title = /** @type {(inputs: Subscriptions_Sheet_Edit_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Edit the subscription`)
};

const fr_subscriptions_sheet_edit_title = /** @type {(inputs: Subscriptions_Sheet_Edit_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Modifier l'abonnement`)
};

/**
* | output |
* | --- |
* | "Edit the subscription" |
*
* @param {Subscriptions_Sheet_Edit_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const subscriptions_sheet_edit_title = /** @type {((inputs?: Subscriptions_Sheet_Edit_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Subscriptions_Sheet_Edit_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_subscriptions_sheet_edit_title(inputs)
	return en_subscriptions_sheet_edit_title(inputs)
});