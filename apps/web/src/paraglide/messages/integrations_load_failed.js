/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Integrations_Load_FailedInputs */

const en_integrations_load_failed = /** @type {(inputs: Integrations_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`The integrations could not be loaded.`)
};

const fr_integrations_load_failed = /** @type {(inputs: Integrations_Load_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Les intégrations n'ont pas pu être chargées.`)
};

/**
* | output |
* | --- |
* | "The integrations could not be loaded." |
*
* @param {Integrations_Load_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const integrations_load_failed = /** @type {((inputs?: Integrations_Load_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Integrations_Load_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_integrations_load_failed(inputs)
	return en_integrations_load_failed(inputs)
});