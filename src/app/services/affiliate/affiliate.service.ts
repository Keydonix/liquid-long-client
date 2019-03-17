import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Address } from "@keydonix/liquid-long-client-library";

@Injectable({
  providedIn: 'root',
})
export class AffiliateService {
  private affiliate: Address;

  constructor(private route: ActivatedRoute) {
    this.route.queryParamMap.subscribe(queryParameters => {
      const queryAffiliate = getAffiliateFromQueryString(queryParameters.get('affiliate'));
      this.affiliate = (/ipfs/.test(window.location.hostname))
        ? queryAffiliate
        : localStorageGetOrSet('affiliate', queryAffiliate, Address.fromHexString.bind(Address));
    });
  }

  public readonly getAffiliate = () => this.affiliate
}

const getAffiliateFromQueryString = (affiliate): Address => {
	if (affiliate === null) return new Address();
	if (!/^(?:0x)?([a-zA-Z0-9]{40})$/.test(affiliate)) return new Address();
	return Address.fromHexString(affiliate);
}

const localStorageGetOrSet = <R>(key: string, fallbackValue: {toString(): string}, deserialize: (x: string) => R): R => {
	const fallbackString = fallbackValue.toString();
	const storageValue = window.localStorage.getItem(key);
	if (!storageValue) window.localStorage.setItem(key, fallbackString);
	return deserialize(storageValue || fallbackString);
}
