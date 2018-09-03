const fs = require('fs');
const path = require('path');

const sourceDir = `${__dirname}/../indigo/_posts`;
const posts = fs.readdirSync(sourceDir);

posts.forEach(p => {
  const dirName = path.basename(p, '.markdown');

  const fullDirPath = `${__dirname}/src/posts/${dirName}`;
    fs.mkdirSync(fullDirPath);
  }

  const sourceFilePath = `${sourceDir}/${p}`;
  const destinationFilePath = `${fullDirPath}/index.markdown`;
  if(!fs.existsSync(destinationFilePath)) {
    fs.copyFileSync(sourceFilePath, destinationFilePath);
  }
});