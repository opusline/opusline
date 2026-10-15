/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Instance_Backup_Last_LabelInputs */

const en_instance_backup_last_label = /** @type {(inputs: Instance_Backup_Last_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Last backup`)
};

const fr_instance_backup_last_label = /** @type {(inputs: Instance_Backup_Last_LabelInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Dernière sauvegarde`)
};

/**
* | output |
* | --- |
* | "Last backup" |
*
* @param {Instance_Backup_Last_LabelInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const instance_backup_last_label = /** @type {((inputs?: Instance_Backup_Last_LabelInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Instance_Backup_Last_LabelInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_instance_backup_last_label(inputs)
	return en_instance_backup_last_label(inputs)
});