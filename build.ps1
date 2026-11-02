$ErrorActionPreference = "Stop"
& node (Join-Path $PSScriptRoot "build.mjs")
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
