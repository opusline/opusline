/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Einvoicing_Error_Company_UnverifiedInputs */

const en_einvoicing_error_company_unverified = /** @type {(inputs: Einvoicing_Error_Company_UnverifiedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Super PDP has not verified your company yet. Test the connection in Settings › Integrations once it has.`)
};

const fr_einvoicing_error_company_unverified = /** @type {(inputs: Einvoicing_Error_Company_UnverifiedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Super PDP n'a pas encore vérifié votre entreprise. Testez la connexion dans Réglages › Intégrations une fois fait.`)
};

/**
* | output |
* | --- |
* | "Super PDP has not verified your company yet. Test the connection in Settings › Integrations once it has." |
*
* @param {Einvoicing_Error_Company_UnverifiedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const einvoicing_error_company_unverified = /** @type {((inputs?: Einvoicing_Error_Company_UnverifiedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Einvoicing_Error_Company_UnverifiedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_einvoicing_error_company_unverified(inputs)
	return en_einvoicing_error_company_unverified(inputs)
});