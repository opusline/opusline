/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Einvoicing_Error_Credentials_RejectedInputs */

const en_einvoicing_error_credentials_rejected = /** @type {(inputs: Einvoicing_Error_Credentials_RejectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Super PDP refused the saved credentials. Check them in Settings › Integrations.`)
};

const fr_einvoicing_error_credentials_rejected = /** @type {(inputs: Einvoicing_Error_Credentials_RejectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Super PDP a refusé les identifiants enregistrés. Vérifiez-les dans Réglages › Intégrations.`)
};

/**
* | output |
* | --- |
* | "Super PDP refused the saved credentials. Check them in Settings › Integrations." |
*
* @param {Einvoicing_Error_Credentials_RejectedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const einvoicing_error_credentials_rejected = /** @type {((inputs?: Einvoicing_Error_Credentials_RejectedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Einvoicing_Error_Credentials_RejectedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_einvoicing_error_credentials_rejected(inputs)
	return en_einvoicing_error_credentials_rejected(inputs)
});