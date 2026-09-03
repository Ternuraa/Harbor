import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(fileURLToPath(new URL('..', import.meta.url)));

const TARGET_DIRS = [
    path.join(ROOT, 'public/images/properties'),
    path.join(ROOT, 'src/assets/images'),
];

async function collectWebpFiles(dir) {
    const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
    const files = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...await collectWebpFiles(fullPath));
            continue;
        }
        if (entry.isFile() && entry.name.endsWith('.webp') && !entry.name.includes('@2x')) {
            files.push(fullPath);
        }
    }

    return files;
}

async function generateRetina(sourcePath) {
    const dir = path.dirname(sourcePath);
    const base = path.basename(sourcePath, '.webp');
    const targetPath = path.join(dir, `${base}@2x.webp`);

    const sourceMeta = await stat(sourcePath);
    const targetMeta = await stat(targetPath).catch(() => null);

    if (targetMeta && targetMeta.mtimeMs >= sourceMeta.mtimeMs) {
        return { sourcePath, targetPath, skipped: true };
    }

    const image = sharp(sourcePath);
    const metadata = await image.metadata();
    const width = metadata.width ?? 400;
    const height = metadata.height ?? 300;

    await image
        .resize(width * 2, height * 2, { fit: 'inside', withoutEnlargement: false })
        .webp({ quality: 82 })
        .toFile(targetPath);

    return { sourcePath, targetPath, skipped: false };
}

async function main() {
    let generated = 0;
    let skipped = 0;

    for (const dir of TARGET_DIRS) {
        const files = await collectWebpFiles(dir);
        for (const file of files) {
            const result = await generateRetina(file);
            if (result.skipped) {
                skipped += 1;
            } else {
                generated += 1;
                console.log(`+ ${path.relative(ROOT, result.targetPath)}`);
            }
        }
    }

    console.log(`Retina images: ${generated} generated, ${skipped} up to date`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
