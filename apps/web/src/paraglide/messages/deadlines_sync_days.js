/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Deadlines_Sync_DaysInputs */

const en_deadlines_sync_days = /** @type {(inputs: Deadlines_Sync_DaysInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Last synchronised ${i?.count} d ago`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`Last synchronised ${i?.count} d ago`);
	return /** @type {LocalizedString} */ ("deadlines_sync_days");
};

const fr_deadlines_sync_days = /** @type {(inputs: Deadlines_Sync_DaysInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Dernière synchronisation il y a ${i?.count} j`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`Dernière synchronisation il y a ${i?.count} j`);
	return /** @type {LocalizedString} */ ("deadlines_sync_days");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "Last synchronised {count} d ago" |
* | "other" | "Last synchronised {count} d ago" |
*
* @param {Deadlines_Sync_DaysInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_sync_days = /** @type {((inputs: Deadlines_Sync_DaysInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Sync_DaysInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_sync_days(inputs)
	return en_deadlines_sync_days(inputs)
});