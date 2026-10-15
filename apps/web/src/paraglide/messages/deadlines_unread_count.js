/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Deadlines_Unread_CountInputs */

const en_deadlines_unread_count = /** @type {(inputs: Deadlines_Unread_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} unread reminder`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} unread reminders`);
	return /** @type {LocalizedString} */ ("deadlines_unread_count");
};

const fr_deadlines_unread_count = /** @type {(inputs: Deadlines_Unread_CountInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} rappel non lu`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} rappels non lus`);
	return /** @type {LocalizedString} */ ("deadlines_unread_count");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} unread reminder" |
* | "other" | "{count} unread reminders" |
*
* @param {Deadlines_Unread_CountInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const deadlines_unread_count = /** @type {((inputs: Deadlines_Unread_CountInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Deadlines_Unread_CountInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_deadlines_unread_count(inputs)
	return en_deadlines_unread_count(inputs)
});