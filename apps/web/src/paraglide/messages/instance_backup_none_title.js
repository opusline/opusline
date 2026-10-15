/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Instance_Backup_None_TitleInputs */

const en_instance_backup_none_title = /** @type {(inputs: Instance_Backup_None_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`No backup recorded`)
};

const fr_instance_backup_none_title = /** @type {(inputs: Instance_Backup_None_TitleInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`Aucune sauvegarde enregistrée`)
};

/**
* | output |
* | --- |
* | "No backup recorded" |
*
* @param {Instance_Backup_None_TitleInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const instance_backup_none_title = /** @type {((inputs?: Instance_Backup_None_TitleInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Instance_Backup_None_TitleInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_instance_backup_none_title(inputs)
	return en_instance_backup_none_title(inputs)
});