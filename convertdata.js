import Metalsmith from 'metalsmith';
import collections from 'metalsmith-collections';
// import layouts from 'metalsmith-layouts';
import markdown from 'metalsmith-markdown';
// import permalinks from 'metalsmith-permalinks';
import multiLanguage from 'metalsmith-multi-language';
import {each, find, merge, omit, concat, compact, keys, filter} from 'lodash';
import filetree from 'metalsmith-filetree';
import ignore from 'metalsmith-ignore';

import nunjucks from 'nunjucks';

import t from './translations';

const source = () => {
  if (process.env.npm_package_config_useGit === 'yes') {
    return process.env.npm_package_config_markdownSourceGitName;
  }
  return process.env.npm_package_config_markdownSourcePath;
};

const lo = (u, l) => u.replace(/^.{3}/g, `/${l}/`);

const nun = new nunjucks.Environment(new nunjucks.FileSystemLoader('layouts'));

nun.addFilter('t', t);
nun.addFilter('l', lo);

nun.addFilter('split', (str, seperator) => str.split(seperator));

nun.addFilter('splitminuslast', (str, seperator) => str.split(seperator).slice(0, -1));

nun.addFilter('jointill', (url, stop) =>
  `${url.substring(0, url.indexOf(stop))}${stop}`
);

nun.addFilter('findtitle', (url, siblings) => {
  const bbb = find(siblings,
    s =>
      s.url === url ||
      s.url === `${url}.html` ||
      s.url === `${url}/` ||
      s.url === `${url}/index.html`
    );
  return bbb ? bbb.title : url;
});

const LOCALES = { default: 'en', locales: ['en', 'ar'] };

Metalsmith(__dirname)
  .use(ignore([
    '.*',
    '.git/**',
    '.git/**/.*',
    '.gitignore',
  ]))
  .metadata({
    sitename: process.env.npm_package_config_siteName,
    siteurl: process.env.npm_package_config_siteUrl,
    description: process.env.npm_package_config_siteDescription,
    generatorname: 'Metalsmith',
    generatorurl: 'http://metalsmith.io/',
  })
  .source(source())
  .destination('./dist')
  .clean(true)
  .use(multiLanguage(LOCALES))
  .use(markdown())
  .use((f, m, d) => {
    console.log(keys(f));
    each(f, (v, k) => {
      // if output file should be html
      if (k.includes('html')) {
        k = k.replace('.html', '') // eslint-disable-line

        if (k === 'ar/index') {
          k = 'index_ar'; //eslint-disable-line
          f[`${k}.html`] = merge({}, v); // eslint-disable-line
          delete f['ar/index.html']; // eslint-disable-line
        }

        if ((!f[`${k}_ar.html`] && !k.includes('_ar'))) {
          f[`${k}_ar.html`] = merge({}, v); // eslint-disable-line
          f[`${k}_ar.html`].locale = 'ar'; // eslint-disable-line
        }

      }  // eslint-disable-line
    });
    d();
  })
  .use((f, m, d) => {
    console.log(keys(f));
    each(f, (v, k) => {
      if (k.includes('html')) {
        delete f[k]; // eslint-disable-line
        let p = k; // eslint-disable-line
        p = p.replace('.md', '.html') // eslint-disable-line
        p = p.replace('_ar', '') // eslint-disable-line
        v.url = p.replace('index.html', ''); // eslint-disable-line
        f[`${v.locale}/${p}`] = v; // eslint-disable-line
        if (v.locale === LOCALES.default) {
          f[p] = Object.assign({}, v); //eslint-disable-line
        }
      }
    });

    d();
  })
  .use(filetree({
    pattern: ':title'
  }))
  .use((f, m, d) => {

    const md = m['_metadata'].fileTree.path; // eslint-disable-line

    each(f, (v, k) => {
      if (k.includes('html')) {
        const ppath = `/${k.replace(/[^\/]*$/, '').slice(0, -1)}`; //eslint-disable-line
        const ft = md[ppath];

        const ff = concat([], ft.files);
        each(ft.children, c => {
          const b2f = `${c.path.substring(1)}/index.html`;
          ff.push(f[b2f]);
        });
        v.siblings = filter(compact(ff), gg => gg.path !== 'en/404.html'); //eslint-disable-line
        v.all = f; // eslint-disable-line
        v.name = v.url.replace(/\//g,'_'); // eslint-disable-line
      }
    });
    d();
  })
  .use((f, m, d) => {
    each(f, (v, k) => {
      if (k.includes('html')) {
        console.log(k);
        console.log(v.layout);
        const deets = Object.assign({}, m['_metadata'], v); // eslint-disable-line
        let rs = nun.render(v.layout, deets);
        rs = rs.replace('.md', '.html');
        f[k].contents = new Buffer(rs); // eslint-disable-line
      }
    });


    d();
  })
  .build((err) => {      // build process
    console.log(err);
    if (err) throw err;       // error handling is required
  });
