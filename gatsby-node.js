const path = require('path');

const uniq = (arrArg) => {
  return arrArg.filter((elem, pos, arr) => {
    return arr.indexOf(elem) == pos;
  });
};

exports.createPages = ({ actions, graphql }) => {
  const { createRedirect, createPage } = actions;
  const postTemplate = path.resolve('src/pages/postTemplate.js');
  const tagTemplate = path.resolve('src/pages/tagTemplate.js');

  createRedirect({
    fromPath: '/ld-react-context-api',
    isPermanent: true,
    redirectInBrowser: true,
    toPath: '/ld-react',
  })

  return graphql(`
    {
      allMarkdownRemark(
        filter: {frontmatter: {published: {eq: true}}}
        sort: { order: DESC, fields: [frontmatter___date] }
        limit: 1000
      ) {
        edges {
          node {
            frontmatter {
              path
              published
              tags
            }
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors);
    }

    const posts = result.data.allMarkdownRemark.edges;

    // blog posts
    posts.forEach(({ node: {frontmatter} }) => {
      createPage({
        path: frontmatter.path,
        component: postTemplate,
        context: {}, // additional data can be passed via context
      });
    });

    // tag pages
    let tags = [];
    // Iterate through each post, putting all found tags into `tags`
    posts.forEach(p => {
      const t = p.node.frontmatter.tags;
      if (t) {
        tags = tags.concat(t);
      }
    })

    // dedupe
    tags = uniq(tags);

    // Make tag pages
    tags.forEach(tag => {
      createPage({
        path: `/tags/${tag}/`,
        component: tagTemplate,
        context: {
          tag,
        },
      })
    });
  });
};