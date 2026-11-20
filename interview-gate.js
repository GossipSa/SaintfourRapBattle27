import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

// All premieres at 19:00 Moscow time (UTC+03:00). Server clock is authoritative.
const premieres = Object.freeze({
  dex: '2026-12-03T16:00:00Z',
  netti: '2026-12-10T16:00:00Z',
  rudi: '2026-12-17T16:00:00Z',
  daro: '2026-12-24T16:00:00Z',
  nadine: '2026-12-31T16:00:00Z',
})
const folder = path.join(os.homedir(), 'Documents', 'saintfour-unreleased-interviews')
const json = (res, code, data) => {
  res.writeHead(code, { 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store' })
  res.end(JSON.stringify(data))
}
function gate(req, res, next) {
  const url = new URL(req.url, 'http://localhost')
  if (url.pathname === '/api/interviews/status') {
    return json(res, 200, {serverTime:new Date().toISOString(), premieres:Object.fromEntries(Object.entries(premieres).map(([id, at])=>[id,{at,available:Date.now()>=Date.parse(at)}]))})
  }
  const match = /^\/api\/interviews\/(dex|netti|rudi|daro|nadine)$/.exec(url.pathname)
  if (!match) return next()
  const id = match[1]
  if (Date.now() < Date.parse(premieres[id])) return json(res, 403, {error:'NOT_RELEASED',premiere:premieres[id]})
  const file = path.join(folder, `${id}.mp4`)
  let size
  try { size = fs.statSync(file).size } catch { return json(res, 404, {error:'VIDEO_NOT_UPLOADED'}) }
  const range = req.headers.range
  res.setHeader('Content-Type','video/mp4')
  res.setHeader('Accept-Ranges','bytes')
  res.setHeader('Cache-Control','no-store')
  res.setHeader('X-Content-Type-Options','nosniff')
  let start=0, end=size-1, status=200
  if (range) {
    const parsed = /^bytes=(\d*)-(\d*)$/.exec(range)
    if (!parsed || (!parsed[1] && !parsed[2])) {res.writeHead(416,{'Content-Range':`bytes */${size}`});return res.end()}
    if (!parsed[1]) {const last=Number(parsed[2]);start=Math.max(0,size-last)}
    else {start=Number(parsed[1]);end=parsed[2]?Math.min(Number(parsed[2]),size-1):end}
    if (start>=size || end<start) {res.writeHead(416,{'Content-Range':`bytes */${size}`});return res.end()}
    status=206
    res.setHeader('Content-Range',`bytes ${start}-${end}/${size}`)
  }
  res.writeHead(status,{'Content-Length':end-start+1})
  if (req.method==='HEAD') return res.end()
  fs.createReadStream(file,{start,end}).pipe(res)
}
export function interviewGatePlugin() {
  return {name:'interview-release-gate',configureServer(server){server.middlewares.use(gate)},configurePreviewServer(server){server.middlewares.use(gate)}}
}
