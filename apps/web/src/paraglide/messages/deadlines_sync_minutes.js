/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Deadlines_Sync_MinutesInputs */

const en_deadlines_sync_minutes = /** @type {(inputs: Deadlines_Sync_MinutesInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Last synchronised ${i?.count} min ago`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`Last synchronised ${i?.count} min ago`);
	return /** @type {LocalizedString} */ ("deadlines_sync_minutes");
};

const fr_deadlines_sync_minutes = /** @type {(inputs: Deadlines_Sync_MinutesInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Dernière synchronisation il y a ${i?.count} min`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`Dernière synchronisation il y a ${i?.count} min`);
	return /** @type {LocalizedString} */ ("deadlines_sync_minutes");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "Last synchronised {count} min ago" |
* | "other" | "Last synchronised {count} min ago" |
*
* @param {Deadlines_Sync_MinutesInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_sync_minutes = /** @type {((inputs: Deadlines_Sync_MinutesInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Sync_MinutesInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_sync_minutes(inputs)
	return en_deadlines_sync_minutes(inputs)
});