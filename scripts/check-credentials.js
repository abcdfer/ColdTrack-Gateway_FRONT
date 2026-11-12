import { execFileSync } from 'node:child_process'

const blockedFiles = /(^|\/)(\.env(?:\..+)?|\.coldtrack\.json|id_(?:rsa|dsa|ed25519|ecdsa)|credentials\.json)$|\.(pem|key|pfx|p12|pkcs12)$/i
const secrets = [
  /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP )?PRIVATE KEY-----/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\beyJ[a-zA-Z0-9_-]{10,}\.eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}/,
  /(?:COLDTRACK_INGEST_KEY|COLDTRACK_SESSION_SECRET|COLDTRACK_DEMO_PASSWORD_HASH|api[_-]?key|access[_-]?token)\s*["']?\s*[:=]\s*["'][\w.-]{20,}["']/i,
]

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' })
const paths = git('diff', '--cached', '--name-only', '-z', '--diff-filter=ACMR').split('\0').filter(Boolean)
const blocked = paths.filter((path) => !path.endsWith('.env.example') && blockedFiles.test(path))
const diff = git('diff', '--cached', '--no-ext-diff', '--unified=0')
const hasSecret = diff.split('\n').some((line) =>
  line.startsWith('+') && !line.startsWith('+++ ') && secrets.some((pattern) => pattern.test(line.slice(1))),
)

if (blocked.length || hasSecret) {
  for (const path of blocked) console.error(`Archivo sensible preparado para commit: ${path}`)
  if (hasSecret) console.error('Se detectó una posible credencial en los cambios preparados para commit.')
  process.exitCode = 1
}
