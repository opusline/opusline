/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Editor_Time_LinkedInputs */

const en_editor_time_linked = /** @type {(inputs: Editor_Time_LinkedInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} time entry billed by this invoice`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} time entries billed by this invoice`);
	return /** @type {LocalizedString} */ ("editor_time_linked");
};

const fr_editor_time_linked = /** @type {(inputs: Editor_Time_LinkedInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} saisie de temps facturée par cette facture`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} saisies de temps facturées par cette facture`);
	return /** @type {LocalizedString} */ ("editor_time_linked");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} time entry billed by this invoice" |
* | "other" | "{count} time entries billed by this invoice" |
*
* @param {Editor_Time_LinkedInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const editor_time_linked = /** @type {((inputs: Editor_Time_LinkedInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Editor_Time_LinkedInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_editor_time_linked(inputs)
	return en_editor_time_linked(inputs)
});