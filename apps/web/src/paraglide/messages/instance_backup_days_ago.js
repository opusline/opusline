/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Instance_Backup_Days_AgoInputs */

const en_instance_backup_days_ago = /** @type {(inputs: Instance_Backup_Days_AgoInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} day ago`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} days ago`);
	return /** @type {LocalizedString} */ ("instance_backup_days_ago");
};

const fr_instance_backup_days_ago = /** @type {(inputs: Instance_Backup_Days_AgoInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`il y a ${i?.count} jour`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`il y a ${i?.count} jours`);
	return /** @type {LocalizedString} */ ("instance_backup_days_ago");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} day ago" |
* | "other" | "{count} days ago" |
*
* @param {Instance_Backup_Days_AgoInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const instance_backup_days_ago = /** @type {((inputs: Instance_Backup_Days_AgoInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Instance_Backup_Days_AgoInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_instance_backup_days_ago(inputs)
	return en_instance_backup_days_ago(inputs)
});