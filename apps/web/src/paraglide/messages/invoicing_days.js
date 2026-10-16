/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ count: NonNullable<unknown> }} Invoicing_DaysInputs */

const en_invoicing_days = /** @type {(inputs: Invoicing_DaysInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("en", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} day`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} days`);
	return /** @type {LocalizedString} */ ("invoicing_days");
};

const fr_invoicing_days = /** @type {(inputs: Invoicing_DaysInputs) => LocalizedString} */ (i) => {const countPlural = registry.plural("fr", i?.count, {});
	if (countPlural === "one") return /** @type {LocalizedString} */ (`${i?.count} jour`);
	if (countPlural === "other") return /** @type {LocalizedString} */ (`${i?.count} jours`);
	return /** @type {LocalizedString} */ ("invoicing_days");
};

/**
* | countPlural | output |
* | --- | --- |
* | "one" | "{count} day" |
* | "other" | "{count} days" |
*
* @param {Invoicing_DaysInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const invoicing_days = /** @type {((inputs: Invoicing_DaysInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Invoicing_DaysInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_invoicing_days(inputs)
	return en_invoicing_days(inputs)
});