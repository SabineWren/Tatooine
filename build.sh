rollup ./scripts/index.js --output.format iife --name "bundle" --output.file ./scripts/bundle.js
rollup ./scripts/geometryWorker.js --output.format iife --name "bundle" --output.file ./scripts/bundleGeometryWorker.js
echo "ran build"
