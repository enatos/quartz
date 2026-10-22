import test from "node:test"
import assert from "node:assert/strict"
import { mkdtemp, writeFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { glob } from "./glob"

test("file discovery keeps normal globs but treats brace patterns literally", async () => {
  const directory = await mkdtemp(join(tmpdir(), "quartz-glob-test-"))
  try {
    for (const name of ["a.md", "b.md", "{a,b}.md"]) await writeFile(join(directory, name), "fixture")
    assert.deepEqual((await glob("**/*.md", directory, ["b.md"])).sort(), ["a.md", "{a,b}.md"])
    assert.deepEqual(await glob("{a,b}.md", directory, []), ["{a,b}.md"])
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
