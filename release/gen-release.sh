# you must already be able to successfully run the build

set -exu
HERE=$(dirname $(realpath $BASH_SOURCE))
cd $HERE

# --- config
releaseName=tab-time-notify_1.0.0
# --- end

releaseName2=${releaseName}_$(date +%Y-%m-%d_%H%M)
releaseDir=$HERE/output/$releaseName2

mkdir -p $releaseDir
cd ..
pnpm b

cp -r build manifest.json version.md $releaseDir
echo "done"