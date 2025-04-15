Release must be run on a computer **that was already able to do the build**.

# Steps
1. Edit version info for these files:
    - `version.md`
    - `package.json`
    - `manifest.json`
    - `gen-release.sh` (check config section)
2. Run `gen-release.sh`
3. Take from output dir. Zip into zip file.
4. git commit, tag, push
5. Make github release. For description, copy from version.md