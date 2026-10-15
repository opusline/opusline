/* eslint-disable */
import * as registry from '../registry.js'
import { getLocale, experimentalStaticLocale } from '../runtime.js';

/** @typedef {import('../runtime.js').LocalizedString} LocalizedString */

/** @typedef {{ days: NonNullable<unknown> }} Clients_Delay_DaysInputs */

const en_clients_delay_days = /** @type {(inputs: Clients_Delay_DaysInputs) => LocalizedString} */ (i) => {const daysPlural = registry.plural("en", i?.days, {});
	if (daysPlural === "one") return /** @type {LocalizedString} */ (`${i?.days} day`);
	if (daysPlural === "other") return /** @type {LocalizedString} */ (`${i?.days} days`);
	return /** @type {LocalizedString} */ ("clients_delay_days");
};

const fr_clients_delay_days = /** @type {(inputs: Clients_Delay_DaysInputs) => LocalizedString} */ (i) => {const daysPlural = registry.plural("fr", i?.days, {});
	if (daysPlural === "one") return /** @type {LocalizedString} */ (`${i?.days} jour`);
	if (daysPlural === "other") return /** @type {LocalizedString} */ (`${i?.days} jours`);
	return /** @type {LocalizedString} */ ("clients_delay_days");
};

/**
* | daysPlural | output |
* | --- | --- |
* | "one" | "{days} day" |
* | "other" | "{days} days" |
*
* @param {Clients_Delay_DaysInputs} inputs
* @param {{ locale?: "en" | "fr" }} options
* @returns {LocalizedString}
*/
export const clients_delay_days = /** @type {((inputs: Clients_Delay_DaysInputs, options?: { locale?: "en" | "fr" }) => LocalizedString) & import('../runtime.js').MessageMetadata<Clients_Delay_DaysInputs, { locale?: "en" | "fr" }, {}>} */ ((inputs, options = {}) => {
	const locale = experimentalStaticLocale ?? options.locale ?? getLocale()
	if (locale === "fr") return fr_clients_delay_days(inputs)
	return en_clients_delay_days(inputs)
});