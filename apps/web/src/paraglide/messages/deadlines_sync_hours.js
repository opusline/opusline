/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Deadlines_Sync_HoursInputs */

const en_deadlines_sync_hours = /** @type {(inputs: Deadlines_Sync_HoursInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Last synchronised ${i?.count} h ago`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`Last synchronised ${i?.count} h ago`);
	return /** @type {LocalizedString} */ ("deadlines_sync_hours");
};

const fr_deadlines_sync_hours = /** @type {(inputs: Deadlines_Sync_HoursInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Dernière synchronisation il y a ${i?.count} h`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`Dernière synchronisation il y a ${i?.count} h`);
	return /** @type {LocalizedString} */ ("deadlines_sync_hours");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "Last synchronised {count} h ago" |
* | "other" | "Last synchronised {count} h ago" |
*
* @param {Deadlines_Sync_HoursInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_sync_hours = /** @type {((inputs: Deadlines_Sync_HoursInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Sync_HoursInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_sync_hours(inputs)
	return en_deadlines_sync_hours(inputs)
});