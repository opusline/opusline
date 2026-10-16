/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Einvoicing_Error_Credentials_Rejected_HereInputs */

const en_einvoicing_error_credentials_rejected_here = /** @type {(inputs: Einvoicing_Error_Credentials_Rejected_HereInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Super PDP refused the saved credentials. Replace them below.`)
};

const fr_einvoicing_error_credentials_rejected_here = /** @type {(inputs: Einvoicing_Error_Credentials_Rejected_HereInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Super PDP a refusé les identifiants enregistrés. Remplacez-les ci-dessous.`)
};

/**
* | output |
* | --- |
* | "Super PDP refused the saved credentials. Replace them below." |
*
* @param {Einvoicing_Error_Credentials_Rejected_HereInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const einvoicing_error_credentials_rejected_here = /** @type {((inputs?: Einvoicing_Error_Credentials_Rejected_HereInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Einvoicing_Error_Credentials_Rejected_HereInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_einvoicing_error_credentials_rejected_here(inputs)
	return en_einvoicing_error_credentials_rejected_here(inputs)
});