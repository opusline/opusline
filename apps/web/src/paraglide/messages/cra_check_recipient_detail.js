/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Check_Recipient_DetailInputs */

const en_cra_check_recipient_detail = /** @type {(inputs: Cra_Check_Recipient_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`will sign the approval`)
};

const fr_cra_check_recipient_detail = /** @type {(inputs: Cra_Check_Recipient_DetailInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`signera le bon pour accord`)
};

/**
* | output |
* | --- |
* | "will sign the approval" |
*
* @param {Cra_Check_Recipient_DetailInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_check_recipient_detail = /** @type {((inputs?: Cra_Check_Recipient_DetailInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Check_Recipient_DetailInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_check_recipient_detail(inputs)
	return en_cra_check_recipient_detail(inputs)
});