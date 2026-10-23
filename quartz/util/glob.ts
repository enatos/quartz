import path from "path"
import { FilePath } from "./path"
import { globby } from "globby"

export function toPosixPath(fp: string): string {
  return fp.split(path.sep).join("/")
}

export async function glob(
  pattern: string,
  cwd: string,
  ignorePatterns: string[],
): Promise<FilePath[]> {
  const fps = (
    await globby(pattern, {
      cwd,
      ignore: ignorePatterns,
      gitignore: true,
      // No brace expansion: braces has no patched release (CVE-2026-93687).
      braceExpansion: false,
    })
  ).map(toPosixPath)
  return fps as FilePath[]
}
