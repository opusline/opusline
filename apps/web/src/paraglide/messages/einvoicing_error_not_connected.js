/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Einvoicing_Error_Not_ConnectedInputs */

const en_einvoicing_error_not_connected = /** @type {(inputs: Einvoicing_Error_Not_ConnectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Connect your e-invoicing platform in Settings › Integrations first.`)
};

const fr_einvoicing_error_not_connected = /** @type {(inputs: Einvoicing_Error_Not_ConnectedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Connectez d'abord votre plateforme de facturation électronique dans Réglages › Intégrations.`)
};

/**
* | output |
* | --- |
* | "Connect your e-invoicing platform in Settings › Integrations first." |
*
* @param {Einvoicing_Error_Not_ConnectedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const einvoicing_error_not_connected = /** @type {((inputs?: Einvoicing_Error_Not_ConnectedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Einvoicing_Error_Not_ConnectedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_einvoicing_error_not_connected(inputs)
	return en_einvoicing_error_not_connected(inputs)
});