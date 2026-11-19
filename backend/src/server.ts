import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import exchangeRatesRouter from './routes/exchangeRates.routes.ts'
import supportRouter from './routes/support.routes.ts'

const app = express()
const PORT = Number(process.env.PORT) || 3000

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/exchange-rates', exchangeRatesRouter)
app.use('/api/support', supportRouter)

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
