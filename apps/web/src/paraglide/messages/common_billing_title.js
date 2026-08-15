/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Common_Billing_TitleInputs */

const en_common_billing_title = /** @type {(inputs: Common_Billing_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Billing`)
};

const fr_common_billing_title = /** @type {(inputs: Common_Billing_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Facturation`)
};

/**
* | output |
* | --- |
* | "Billing" |
*
* @param {Common_Billing_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const common_billing_title = /** @type {((inputs?: Common_Billing_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Common_Billing_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_common_billing_title(inputs)
	return en_common_billing_title(inputs)
});