class CurrencyUtil {
  public readonly currency = 'THB'
  public readonly locale = 'th-TH'

  format(amount: number, options?: Intl.NumberFormatOptions) {
    return amount.toLocaleString(this.locale, {
      ...options,
      maximumFractionDigits: 0,
      currency: this.currency
    })
  }

  toZeroDecimalAmount(amount: number) {
    return parseInt(
      amount.toString().substring(0, amount.toString().length - 2)
    )
  }
}

export const currencyUtil = new CurrencyUtil()
