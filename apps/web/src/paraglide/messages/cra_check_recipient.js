/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Cra_Check_RecipientInputs */

const en_cra_check_recipient = /** @type {(inputs: Cra_Check_RecipientInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Recipient`)
};

const fr_cra_check_recipient = /** @type {(inputs: Cra_Check_RecipientInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Destinataire`)
};

/**
* | output |
* | --- |
* | "Recipient" |
*
* @param {Cra_Check_RecipientInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const cra_check_recipient = /** @type {((inputs?: Cra_Check_RecipientInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Cra_Check_RecipientInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_cra_check_recipient(inputs)
	return en_cra_check_recipient(inputs)
});