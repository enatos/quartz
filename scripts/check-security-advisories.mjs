// Reports all advisories; permits only documented, version-specific mitigations.
// Unknown findings, missing metadata, registry errors and overdue reviews fail CI.
import fs from "node:fs"
const filename = process.argv[2]
if (!filename) throw new Error("Pass a complete npm audit JSON report")
const audit = JSON.parse(fs.readFileSync(filename, "utf8"))
const policy = JSON.parse(fs.readFileSync(new URL("../.github/security-advisory-exceptions.json", import.meta.url), "utf8"))
const lock = JSON.parse(fs.readFileSync(new URL("../package-lock.json", import.meta.url), "utf8"))
if (audit.error || !audit.metadata || !audit.vulnerabilities) throw new Error("Dependency audit did not complete")
const allowed = new Map(policy.exceptions.map(item => [item.id, item]))
const findings = new Map()
const rejected = []
for (const [name, value] of Object.entries(audit.vulnerabilities)) {
  for (const via of value.via ?? []) {
    if (typeof via === "string") {
      if (!audit.vulnerabilities[via]) throw new Error("Incomplete advisory dependency graph")
      continue
    }
    const id = via.url?.match(/\/(GHSA-[a-z0-9-]+)$/)?.[1]
    if (!id) throw new Error("Advisory identifier is missing")
    findings.set(id, via.name)
    const exception = allowed.get(id)
    const matched = exception && exception.package === name && value.nodes.length > 0 && value.nodes.every(node => lock.packages[node]?.version === exception.version)
    if (!matched) rejected.push(id)
  }
}
if (Object.keys(audit.vulnerabilities).length && !findings.size) throw new Error("Audit graph has no root advisories")
for (const [id] of findings) {
  const exception = allowed.get(id)
  console.log(exception ? `MITIGATED / still present: ${id}: ${exception.reason}` : `ACTION REQUIRED: ${id}`)
}
if (findings.size && new Date().toISOString().slice(0, 10) > policy.review_by) throw new Error("Known advisory mitigations require renewed review")
console.log(`Audited vulnerable packages: ${Object.keys(audit.vulnerabilities).length}; distinct advisories: ${findings.size}`)
if (rejected.length) throw new Error("New or unmitigated dependency advisories require review: " + [...new Set(rejected)].join(", "))
