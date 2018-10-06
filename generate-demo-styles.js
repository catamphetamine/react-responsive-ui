const fs = require('fs')
const path = require('path')

var autoprefixer = require('autoprefixer')
var postcss = require('postcss')

RegExp.escape = function (string)
{
	const specials = new RegExp("[.*+?|()\\[\\]{}\\\\]", "g")
	return string.replace(specials, "\\$&")
}

String.prototype.replace_all = function (what, with_what)
{
	const regexp = new RegExp(RegExp.escape(what), "g")
	return this.replace(regexp, with_what)
}

function transformStyle(filePath)
{
  let text = fs.readFileSync(path.join(__dirname, filePath), 'utf8')
    /* Base */
    .replace_all('var(--rrui-unit)', '0.6rem')
    /* Everything */
    .replace_all('var(--rrui-input-height)', 'calc(0.6rem * 3)')
    .replace_all('var(--rrui-fullscreen-input-height)', 'calc(0.6rem * 4)')
    /* `<TextInput/>`, `<Select/>`, `<Autocomplete/>` input side padding. */
    .replace_all('var(--rrui-input-field-side-padding)', '0rem')
    /* `<TextInput multiline/>` */
    .replace_all('var(--rrui-multiline-text-height)', 'calc(0.6rem * 7)')
    .replace_all('var(--rrui-multiline-text-input-vertical-padding)', '0.6rem')
    /* `<Button/>` */
    .replace_all('var(--rrui-button-side-padding)', '0rem')
    /* `<Select/>` */
    .replace_all('var(--rrui-list-vertical-padding)', '0.6rem')
    .replace_all('var(--rrui-list-item-side-padding)', 'calc(0.6rem * 1.5)')
    .replace_all('var(--rrui-list-item-height)', 'calc(0.6rem * 4)')
    .replace_all('var(--rrui-list-icon-margin)', '0.6rem')
    /* `<Select menu/>` */
    .replace_all('var(--rrui-collapsible-menu-item-side-padding)', 'calc(0.6rem * 2.5)')
    /* `<Snackbar/>` */
    .replace_all('var(--rrui-snackbar-height)', 'calc(0.6rem * 4)')
    .replace_all('var(--rrui-snackbar-side-padding)', 'calc(0.6rem * 1.5)')
    .replace_all('var(--rrui-snackbar-margin)', 'calc(0.6rem * 2)')
    /* `<Tooltip/>` */
    .replace_all('var(--rrui-tooltip-side-padding)', 'calc(0.6rem * 1.5)')
    .replace_all('var(--rrui-tooltip-height)', 'calc(0.6rem * 4)')
    /* `<Switch/>` and `<Checkbox/>` */
    .replace_all('var(--rrui-control-label-margin)', '0.6rem')
    /* Close icon */
    .replace_all('var(--rrui-close-margin)', 'calc(0.6rem * 2)')
    .replace_all('var(--rrui-close-size)', 'calc(0.6rem * 2)')
    /* Border radius */
    .replace_all('var(--rrui-border-radius-big)', '0.2rem')
    .replace_all('var(--rrui-border-radius-small)', '0.1rem')
    /* Colors */
    .replace_all('var(--rrui-white-color)', '#ffffff')
    .replace_all('var(--rrui-black-color)', '#000000')
    .replace_all('var(--rrui-accent-color)', '#03b2cb')
    .replace_all('var(--rrui-accent-color-light)', '#2bd7f0')
    .replace_all('var(--rrui-error-color)', '#d30f00')
    /* Gray is used as `<TextInput/>` `label` placeholder color. */
    .replace_all('var(--rrui-gray-color)', '#888888')
    /* `<DatePicker/>` disabled day color. */
    .replace_all('var(--rrui-gray-color-light)', '#cacaca')
    /* `<TextInput/>`, `<Select/>` and `<DatePicker/>` border color. */
    .replace_all('var(--rrui-input-field-border-color)', '#cacaca')
    .replace_all('var(--rrui-input-field-border-color-focus)', '#03b2cb')
    /* `<TextInput/>`, `<Select/>` and `<DatePicker/>` label color. */
    .replace_all('var(--rrui-input-field-label-color)', '#888888')
    .replace_all('var(--rrui-input-field-label-color-focus)', '#03b2cb')
    /* Lightest Gray is used as `<Select/>` options hover background color. */
    /* Lightest Gray is used as `<Select/>`'s currently selected option background color. */
    .replace_all('var(--rrui-gray-color-lightest)', '#F3F3F3')
    /* z-index */
    .replace_all('var(--rrui-z-index-overlay)', '100')
    .replace_all('var(--rrui-z-index-above-overlay)', '101')
    .replace_all('var(--rrui-menu-button-animation-duration)', '0.25s')
    .replace_all('var(--rrui-slideout-menu-animation-duration)', '220ms')

  if (text.indexOf('/*') === 0) {
    text = text.slice(text.indexOf('*/') + '*/'.length).trim()
  }

  if (text.indexOf(':root') === 0) {
    text = text.slice(text.indexOf('}') + 1)
  }

  if (text.indexOf(':root') >= 0) {
    throw new Error('Variables declaration not removed')
  }

  if (text.indexOf('var(--') >= 0) {
    throw new Error(`Not all vars provided for substitution: ${text.slice(text.indexOf('var(--'), text.indexOf(')', text.indexOf('var(--')) + 1)}.`)
  }

  // Remove nested `calc()`s.
  text = text.split('\n').map((line) => {
    while (/calc(.+)calc/.test(line)) {
      line = line.replace(/calc(.+)calc\(([^)]*)\)(.*);/, 'calc$1$2$3;')
    }
    return line
  }).join('\n')

  text.split('\n').forEach((line) => {
    if (/calc(.+)calc/.test(line)) {
      throw new Error('Nested calcs left')
    }
  })

  return postcss([ autoprefixer({ browsers: 'last 4 versions, iOS >= 7, Android >= 4'.split(', ') }) ]).process(text, { from: undefined }).then((result) =>
  {
    result.warnings().forEach((warn) => console.warn(warn.toString()))
    fs.writeFileSync(path.join(__dirname, 'bundle', filePath), result.css)
  })
}

readFiles(path.join(__dirname, 'small-screen')).then((files) =>
{
  const styles = ['style.css']
  for (const file of files) {
    styles.push('small-screen/' + file.filename)
  }
  return Promise.all(styles.map(style => transformStyle(style)))
})

// https://stackoverflow.com/questions/10049557/reading-all-files-in-a-directory-store-them-in-objects-and-send-the-object

function promiseAllP(items, block) {
    var promises = [];
    items.forEach(function(item,index) {
        promises.push( function(item,i) {
            return new Promise(function(resolve, reject) {
                return block.apply(this,[item,index,resolve,reject]);
            });
        }(item,index))
    });
    return Promise.all(promises);
}

function readFiles(dirname) {
    return new Promise((resolve, reject) => {
        fs.readdir(dirname, function(err, filenames) {
            if (err) return reject(err);
            promiseAllP(filenames,
            (filename,index,resolve,reject) =>  {
                fs.readFile(path.resolve(dirname, filename), 'utf-8', function(err, content) {
                    if (err) return reject(err);
                    return resolve({filename: filename, contents: content});
                });
            })
            .then(results => {
                return resolve(results);
            })
            .catch(error => {
                return reject(error);
            });
        });
  });
}