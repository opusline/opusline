/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Instance_Backup_FailedInputs */

const en_instance_backup_failed = /** @type {(inputs: Instance_Backup_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Could not read this instance.`)
};

const fr_instance_backup_failed = /** @type {(inputs: Instance_Backup_FailedInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Impossible de lire cette instance.`)
};

/**
* | output |
* | --- |
* | "Could not read this instance." |
*
* @param {Instance_Backup_FailedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const instance_backup_failed = /** @type {((inputs?: Instance_Backup_FailedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Instance_Backup_FailedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_instance_backup_failed(inputs)
	return en_instance_backup_failed(inputs)
});