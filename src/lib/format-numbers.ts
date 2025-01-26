export class FormatNumbers {
  constructor() {}

  static formatsScaledAmount(amount: number) {
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(amount)
  }

  static formatTokenAmount(amount: number) {
    let scaledAmount: number
    scaledAmount = amount / 1e6
    return this.formatsScaledAmount(scaledAmount)

    // if (amount >= 1e9) {
    //   scaledAmount = amount / 1e6
    //   console.log('SCALED AMOUNT with 1e6', scaledAmount)
    //   return this.formatsScaledAmount(scaledAmount)
    // } else if (amount >= 1e8) {
    //   scaledAmount = amount / 1e5
    //   console.log('SCALED AMOUNT with 1e5', scaledAmount)
    //   return this.formatsScaledAmount(scaledAmount)
    // } else if (amount >= 1e6) {
    //   scaledAmount = amount / 1e3
    //   console.log('SCALED AMOUNT with 1e3', scaledAmount)
    //   return this.formatsScaledAmount(scaledAmount)
    // } else {
    //   scaledAmount = amount
    //   return this.formatsScaledAmount(scaledAmount)
    // }
  }

  static formatPrice(value: number): string {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(2)}B`
    } else if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(2)}M`
    } else if (value >= 1_000) {
      return `${(value / 1_000).toFixed(2)}K`
    } else {
      return value.toFixed(2)
    }
  }

  static formatTokenPrice(price: number): string {
    return price.toFixed(8).replace(/^(0\.)(0+)(\d+)/, (_, p1, p2, p3) => {
      return `0.{${p2.length}}${p3}`
    })
  }
}
