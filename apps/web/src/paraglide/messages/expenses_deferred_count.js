/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Expenses_Deferred_CountInputs */

const en_expenses_deferred_count = /** @type {(inputs: Expenses_Deferred_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Deferred to the next CA3`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} expenses deferred`);
	return /** @type {LocalizedString} */ ("expenses_deferred_count");
};

const fr_expenses_deferred_count = /** @type {(inputs: Expenses_Deferred_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`Reportée sur la prochaine CA3`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} dépenses reportées`);
	return /** @type {LocalizedString} */ ("expenses_deferred_count");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "Deferred to the next CA3" |
* | "other" | "{count} expenses deferred" |
*
* @param {Expenses_Deferred_CountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const expenses_deferred_count = /** @type {((inputs: Expenses_Deferred_CountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Expenses_Deferred_CountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_expenses_deferred_count(inputs)
	return en_expenses_deferred_count(inputs)
});