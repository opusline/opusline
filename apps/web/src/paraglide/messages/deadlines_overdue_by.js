/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Deadlines_Overdue_ByInputs */

const en_deadlines_overdue_by = /** @type {(inputs: Deadlines_Overdue_ByInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} day late`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} days late`);
	return /** @type {LocalizedString} */ ("deadlines_overdue_by");
};

const fr_deadlines_overdue_by = /** @type {(inputs: Deadlines_Overdue_ByInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`en retard d’${i?.count} jour`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`en retard de ${i?.count} jours`);
	return /** @type {LocalizedString} */ ("deadlines_overdue_by");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} day late" |
* | "other" | "{count} days late" |
*
* @param {Deadlines_Overdue_ByInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_overdue_by = /** @type {((inputs: Deadlines_Overdue_ByInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Overdue_ByInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_overdue_by(inputs)
	return en_deadlines_overdue_by(inputs)
});