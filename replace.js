const fs = require('fs');
const path = require('path');

const dir = 'c:/Users/User/Desktop/demo/earphones';

function processDir(directory) {
    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (!file.includes('.git') && !file.includes('images') && !file.includes('vedio')) {
                processDir(fullPath);
            }
        } else {
            if (fullPath.endsWith('.html') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
                let content = fs.readFileSync(fullPath, 'utf8');
                let newContent = content
                    .replace(/SKARA\./g, 'SKARA.')
                    .replace(/SKARA/g, 'SKARA')
                    .replace(/Skara/g, 'Skara')
                    .replace(/skara/g, 'skara');
                if (content !== newContent) {
                    fs.writeFileSync(fullPath, newContent, 'utf8');
                    console.log('Updated', fullPath);
                }
            }
        }
    }
}

processDir(dir);
