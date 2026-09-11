/* eslint-disable */
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{}} Instance_Backup_TodayInputs */

const en_instance_backup_today = /** @type {(inputs: Instance_Backup_TodayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`today`)
};

const fr_instance_backup_today = /** @type {(inputs: Instance_Backup_TodayInputs) => LocalizedString} */ () => {
	return /** @type {LocalizedString} */ (`aujourd'hui`)
};

/**
* | output |
* | --- |
* | "today" |
*
* @param {Instance_Backup_TodayInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const instance_backup_today = /** @type {((inputs?: Instance_Backup_TodayInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Instance_Backup_TodayInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs = {}, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_instance_backup_today(inputs)
	return en_instance_backup_today(inputs)
});