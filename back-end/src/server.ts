import "dotenv/config"
import express from "express"
import { apiRoutes } from "./routes/index.js"
import { errorHandlerMiddleware } from "./middlewares/errors/error-handler.js"
import cookieParser from "cookie-parser"
import { globalRateLimit } from "./middlewares/rate-limit.js"

const app = express()

if (process.env["TRUST_PROXY"]) app.set("trust proxy", Number(process.env["TRUST_PROXY"]))

app.use(globalRateLimit)
app.use(express.json())
app.use(cookieParser())

app.use("/api", apiRoutes)
app.use(errorHandlerMiddleware);

const requiredEnvs = ["DATABASE_URL", "JWT_SECRET", "PORT"] as const
const missingEnvs = requiredEnvs.filter((name) => !process.env[name])

if (missingEnvs.length > 0) {
  console.error(`Variáveis de ambiente ausentes: ${missingEnvs.join(", ")}`)
  process.exit(1)
}

const PORT = process.env.PORT

app.listen(PORT, () => console.log(`API iniciado em http://localhost:${PORT}`))
