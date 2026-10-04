const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
export const money = (n) => usd.format(Number(n || 0))
export const dateShort = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
export const greetingFor = (hour = new Date().getHours()) =>
  hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

// standard amortised monthly payment
export function monthlyPayment(amount, aprPercent, months) {
  const a = Number(amount), n = Number(months), r = Number(aprPercent) / 100 / 12
  if (!a || !n) return 0
  if (!r) return a / n
  return (a * r) / (1 - Math.pow(1 + r, -n))
}
