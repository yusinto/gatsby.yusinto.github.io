const fs = require('fs');
const path = require('path');

const getField = (frontmatter, fieldName) => {
  const fields = frontmatter.split('\n');
  let i;
  for (i = 0; i < fields.length; i++) {
    const field = fields[i];
    if (field.includes(fieldName)) {
      const value = field.split(': ');
      return value[1];
    }
  }
};

const sourceDir = `${__dirname}/../indigo/_posts`;
const posts = fs.readdirSync(sourceDir);

posts.forEach(p => {
  const dirName = path.basename(p, '.markdown');

  if (!dirName.startsWith('2018-07-13') &&
    !dirName.startsWith('2018-05-30') &&
    !dirName.startsWith('2018-04-27') &&
    !dirName.startsWith('2018-03-28') &&
    !dirName.startsWith('2018-01-18') &&
    !dirName.startsWith('2018-01-14') &&
    !dirName.startsWith('2018-01-9')
  ) {
    const fullDirPath = `${__dirname}/src/posts/${dirName}`;
    if (!fs.existsSync(fullDirPath)) {
      fs.mkdirSync(fullDirPath);
    }

    // copy markdown file from indigo to gatsby
    const sourceFilePath = `${sourceDir}/${p}`;
    const destinationFilePath = `${fullDirPath}/index.markdown`;
    if (!fs.existsSync(destinationFilePath)) {
      fs.copyFileSync(sourceFilePath, destinationFilePath);
    }

    /**
     ---
     published: true
     title: "Relay Modern Persisted Queries"
     layout: post
     date: 2017-11-12 07:30
     tag:
     - relay
     - modern
     - persisted
     - queries
     - graphql
     - javascript
     - js
     blog: true
     ---
     */

    if (dirName.includes('relay-modern-')) { // for debugging only
      // frontmatter
      const mdContents = fs.readFileSync(destinationFilePath, {encoding: 'utf-8'});
      const frontmatter = mdContents.split('---\n')[1];
      const result = [];

      let path = dirName.split('-').splice(3).join('-');
      path = `path: "/${path}"`;
      result.push(path);

      let date = getField(frontmatter, 'date');
      date = date.split(' ')[0];
      date = `date: "${date}"`;
      result.push(date);

      let title = getField(frontmatter, 'title');
      title = `title: "${title}"`;
      result.push(title);
      result.push('published: true');

      console.log(result.join('\n'));

      // TODO: generate tags

      // TODO: replace {% highlight xxx %} with ```xxx

      // TODO: remove {:target="_blank"}

      // TODO: replace images with <img src="/static/content-group-xxx.png" id="markdownImage"/>
    }
  }
});