interface CurrencyResult {
    amount: number
    base: string
    date: string
    rates: {
        [a: string]: number
    }
}

class Currency {
    api = 'https://api.frankfurter.app'
    constructor(public currencies: string[]) {}

    convert(from: string, to: string, amount: number) {
         return fetch(`${this.api}/latest?from=${from}&to=${to}&amount=${amount}`)
                .then((x) => x.json() as any as CurrencyResult)
                .then((a) => a)
    }

    log() {
        return this.currencies;
    }
}

const myCurrency = new Currency(['USD', 'JPY', 'THB']);
myCurrency.convert("USD", "THB", 1).then(console.log)