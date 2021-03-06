const fs = require('fs');
const path = require('path');

const replaceAll = (source, search, replacement) => {
  return source.replace(new RegExp(search, 'g'), replacement);
};

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

const getTags = (frontmatter) => {
  let result = frontmatter.replace('blog: true\n', '');
  return result.split('tag:')[1].split('\n-').filter(v => v).map(v => `"${v.trim()}"`);
};

const replaceImages = (content, targetDir) => {
  const allImages = content.match(/!\[.*\]\(.*\)/gi);
  if (!allImages) return null;

  let markdown = content;
  let frontmatterFiles = ['files:'];

  allImages.forEach(r => {
    const match = /!\[(.*)\]\((.*)\)/gi.exec(r);
    const alt = match[1];
    const relativePath = match[2];
    const filename = path.basename(relativePath);

    frontmatterFiles.push(` - "./${filename}"`);

    // copy image from indigo to gatsby
    fs.copyFileSync(`${__dirname}/../indigo${relativePath}`, `${targetDir}/${filename}`);

    // get the static filename generated by gatsby in the public/static folder
    const filenameWithoutExtension = path.parse(relativePath).name;
    const hashedFilename = fs.readdirSync(`${__dirname}/public/static`).find(f => f.startsWith(filenameWithoutExtension));

    // replace markdown with image tag
    markdown = markdown.replace(match[0], `<img alt="${alt}" src="/static/${hashedFilename}" id="markdownImage"/>`);
  });

  return {frontmatterFiles, markdown};
};

const sourceDir = `${__dirname}/../indigo/_posts`;
const posts = fs.readdirSync(sourceDir);

posts.forEach(p => {
  const dirName = path.basename(p, '.markdown');

  if (!dirName.startsWith('2018-07-13') &&
    !dirName.startsWith('2018-05-30') &&
    !dirName.startsWith('2018-04-27') &&
    !dirName.startsWith('2018-03-28') &&
    !dirName.startsWith('2018-02-28') &&
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
    if (fs.existsSync(destinationFilePath)) { // delete index.markdown if it exists
      fs.unlinkSync(destinationFilePath)
    }

    // if (dirName.includes('2016-06')) { // for debugging only
    console.log(`Processing ${p}`);
    let mdContents = fs.readFileSync(sourceFilePath, {encoding: 'utf-8'});
    const mdContentsSplit = mdContents.split('---\n', 2);
    const frontmatter = mdContentsSplit[1];
    let markdownResult = mdContents.replace(frontmatter, '').replace('---\n', '').replace('---\n', '');
    let frontmatterResult = ['---'];

    let path = dirName.split('-').splice(3).join('-');
    path = `path: "/${path}"`;
    frontmatterResult.push(path);

    let date = getField(frontmatter, 'date');
    date = date.split(' ')[0];
    date = `date: "${date}"`;
    frontmatterResult.push(date);

    let title = getField(frontmatter, 'title');
    title = `title: ${title}`;
    frontmatterResult.push(title);
    frontmatterResult.push('published: true');

    const tags = getTags(frontmatter);
    frontmatterResult.push(`tags: [${tags.join(', ')}]`);

    const replaceImagesResult = replaceImages(markdownResult, fullDirPath);
    if (replaceImagesResult) {
      markdownResult = replaceImagesResult.markdown;
      frontmatterResult = frontmatterResult.concat(replaceImagesResult.frontmatterFiles);
    }

    markdownResult = replaceAll(markdownResult, '{% highlight javascript %}', '```jsx');
    markdownResult = replaceAll(markdownResult, '{% highlight js %}', '```jsx');
    markdownResult = replaceAll(markdownResult, '{% highlight json %}', '```json');
    markdownResult = replaceAll(markdownResult, '{% highlight xml %}', '```xml');
    markdownResult = replaceAll(markdownResult, '{% highlight c# %}', '```jsx');
    markdownResult = replaceAll(markdownResult, '{% highlight C# %}', '```jsx');
    markdownResult = replaceAll(markdownResult, '{% highlight raw %}', '```bash');
    markdownResult = replaceAll(markdownResult, '{% highlight bash %}', '```bash');
    markdownResult = replaceAll(markdownResult, '{% highlight graphql %}', '```graphql');
    markdownResult = replaceAll(markdownResult, '{% highlight css %}', '```css');
    markdownResult = replaceAll(markdownResult, '{% highlight html %}', '```html');
    markdownResult = replaceAll(markdownResult, '{% highlight shell %}', '```bash');
    markdownResult = replaceAll(markdownResult, '{% endhighlight %}', '```');
    markdownResult = replaceAll(markdownResult, '{:target="_blank"}', '');
    markdownResult = replaceAll(markdownResult, 'http://www.reactjunkie.com', '');

    frontmatterResult.push('---');

    frontmatterResult = frontmatterResult.join('\n');

    const finalResult = `${frontmatterResult}\n${markdownResult}`;
    fs.writeFileSync(destinationFilePath, finalResult);
    // }
  }
});