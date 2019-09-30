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

    /*--------*/
    /* Colors */
    /*--------*/

    /* `<TextInput/>`, `<Select/>` and `<DatePicker/>` border color. */
    .replace_all('var(--rrui-input-field-border-color)', 'var(--rrui-gray-color-light)')
    .replace_all('var(--rrui-input-field-border-color-focus)', 'var(--rrui-accent-color)')
    .replace_all('var(--rrui-input-field-border-color-error-focus)', 'var(--rrui-input-field-border-color-error)')
    .replace_all('var(--rrui-input-field-border-color-error)', 'var(--rrui-error-color)')
    /* `<TextInput/>`, `<Select/>` and `<DatePicker/>` label. */
    .replace_all('var(--rrui-input-label-focus-top-offset)', '-70%')
    .replace_all('var(--rrui-input-label-focus-scale)', '0.8')
    /* `<TextInput/>`, `<Select/>` and `<DatePicker/>` label color. */
    .replace_all('var(--rrui-input-field-label-color)', 'var(--rrui-gray-color)')
    .replace_all('var(--rrui-input-field-label-color-focus)', 'var(--rrui-accent-color)')
    .replace_all('var(--rrui-input-field-label-color-error)', 'var(--rrui-error-color)')
    /* `<Select/>` toggler. */
    .replace_all('var(--rrui-select-toggler-text-color-active)', 'var(--rrui-accent-color)')
    .replace_all('var(--rrui-select-toggler-text-color-empty)', 'var(--rrui-gray-color)')
    .replace_all('var(--rrui-select-toggler-transition)', 'color 30ms ease-out')
    /* `<List/>` */
    .replace_all('var(--rrui-list-item-background-color-selected)', 'var(--rrui-accent-color)')
    .replace_all('var(--rrui-list-item-text-color-selected)', 'var(--rrui-white-color)')
    .replace_all('var(--rrui-list-item-background-color-focus)', 'var(--rrui-gray-color-lightest)')
    .replace_all('var(--rrui-list-item-text-color-focus)', 'var(--rrui-list-item-text-color)')
    .replace_all('var(--rrui-list-item-background-color)', 'var(--rrui-card-background-color)')
    .replace_all('var(--rrui-list-item-text-color)', 'var(--rrui-card-text-color)')
    /* Button colors */
    .replace_all('var(--rrui-button-background-color-active)', 'var(--rrui-button-background-color)')
    .replace_all('var(--rrui-button-background-color)', 'transparent')
    .replace_all('var(--rrui-button-transition)', 'none')
    .replace_all('var(--rrui-button-text-color)', 'var(--rrui-accent-color)')
    .replace_all('var(--rrui-button-text-color-active)', 'var(--rrui-accent-color-light)')
    /* `<TextInput/>`, `<Select/>`, `<Autocomplete/>`, etc. */
    .replace_all('var(--rrui-input-field-background-color-disabled)', 'var(--rrui-input-field-background-color)')
    .replace_all('var(--rrui-input-field-background-color-focus)', 'var(--rrui-input-field-background-color)')
    .replace_all('var(--rrui-input-field-background-color-error-focus)', 'var(--rrui-input-field-background-color-error)')
    .replace_all('var(--rrui-input-field-background-color-error)', 'var(--rrui-input-field-background-color)')
    .replace_all('var(--rrui-input-field-background-color)', 'var(--rrui-white-color)')
    .replace_all('var(--rrui-input-field-transition)', 'border 0.1s')
    .replace_all('var(--rrui-input-field-text-color)', 'var(--rrui-black-color)')
    .replace_all('var(--rrui-input-field-font-size)', 'inherit')
    .replace_all('var(--rrui-input-field-border-radius)', '0rem')
    .replace_all('var(--rrui-input-field-border-width)', '0px')
    .replace_all('var(--rrui-input-field-border-bottom-width)', '1px')
    .replace_all('var(--rrui-input-field-icon-size)', 'calc(var(--rrui-input-height) - 1.5 * var(--rrui-unit))')
    .replace_all('var(--rrui-input-field-icon-margin-left)', '0px')
    .replace_all('var(--rrui-input-field-icon-margin-right)', 'calc(0.75 * var(--rrui-unit))')
    .replace_all('var(--rrui-input-field-icon-color)', 'var(--rrui-gray-color)')
    /* `<Expandable/>`. */
    .replace_all('var(--rrui-expandable-transition-hide)', 'all 150ms ease-out')
    .replace_all('var(--rrui-expandable-transition-show)', 'all 150ms cubic-bezier(0.23, 1, 0.32, 1)')
    .replace_all('var(--rrui-expandable-transform-hide)', 'scaleY(0.8)')
    .replace_all('var(--rrui-expandable-transform-show)', 'scaleY(1)')
    .replace_all('var(--rrui-expandable-transform-origin)', '50% top 0px')
    .replace_all('var(--rrui-expandable-transform-origin-upward)', '50% bottom 0px')
    .replace_all('var(--rrui-expandable-content-transition)', 'opacity 100ms ease-out')
    .replace_all('var(--rrui-expandable-content-opacity-hide)', '0')
    .replace_all('var(--rrui-expandable-margin)', '1em')
    .replace_all('var(--rrui-expandable-fade-distance)', '0.5em')
    /* `<Switch/>`. */
    // IE11 doesn't know how to `calc()` inside `transform`, so it's precalculated.
    // .replace_all('var(--rrui-switch-knob-translate-on)', 'calc(var(--rrui-switch-width) - var(--rrui-switch-knob-size) - (var(--rrui-switch-height) - var(--rrui-switch-knob-size)))')
    // translateX(calc(1.65em - 0.875em - (1em - 0.875em)))
    .replace_all('var(--rrui-switch-knob-translate-on)', '0.65em')
    .replace_all('var(--rrui-switch-width)', '1.65em')
    .replace_all('var(--rrui-switch-height)', '1em')
    .replace_all('var(--rrui-switch-clickable-padding)', 'calc(var(--rrui-unit) / 2)')
    .replace_all('var(--rrui-switch-focus-outline-shadow)', '0 0 0 0 transparent')
    .replace_all('var(--rrui-switch-knob-border-color-focus)', 'var(--rrui-accent-color)')
    .replace_all('var(--rrui-switch-knob-background-color-on)', 'var(--rrui-switch-knob-background-color)')
    .replace_all('var(--rrui-switch-knob-background-color)', 'var(--rrui-switch-background-color)')
    .replace_all('var(--rrui-switch-background-color)', 'var(--rrui-checkbox-fill-color)')
    .replace_all('var(--rrui-switch-accent-color)', 'var(--rrui-checkbox-color-checked)')
    .replace_all('var(--rrui-switch-label-color-on)', 'initial')
    .replace_all('var(--rrui-switch-groove-border-color)', 'rgba(0,0,0,0.16)')
    .replace_all('var(--rrui-switch-groove-border-width)', '0.0625em')
    .replace_all('var(--rrui-switch-groove-transition)', 'all 0.40s cubic-bezier(.17,.67,.43,.98)')
    .replace_all('var(--rrui-switch-knob-size)', '0.875em')
    .replace_all('var(--rrui-switch-knob-transition)', 'all 0.25s ease-out')
    .replace_all('var(--rrui-switch-knob-box-shadow)', 'inset 0 0 0 0.03em rgba(0,0,0,0.3), 0 0 0.05em rgba(0,0,0,0.05), 0 0.1em 0.2em rgba(0,0,0,0.2)')
    /* Checkbox size */
    .replace_all('var(--rrui-checkbox-size)', '0.9em')
    /* Checkbox colors */
    .replace_all('var(--rrui-checkbox-stroke-color)', 'var(--rrui-black-color)')
    .replace_all('var(--rrui-checkbox-fill-color)', 'var(--rrui-white-color)')
    .replace_all('var(--rrui-checkbox-color-checked)', 'var(--rrui-accent-color)')
    .replace_all('var(--rrui-checkbox-color-checked-focus)', 'var(--rrui-checkbox-color-focus)')
    .replace_all('var(--rrui-checkbox-color-focus)', 'var(--rrui-accent-color)')
    .replace_all('var(--rrui-checkbox-color-active)', 'var(--rrui-accent-color-light)')
    .replace_all('var(--rrui-checkbox-focus-ring-size)', '250%')
    .replace_all('var(--rrui-checkbox-focus-ring-background-color)', 'transparent') // 'var(--rrui-gray-color-lightest)')
    .replace_all('var(--rrui-checkbox-focus-ring-background-color-active)', 'transparent')
    /* `<Modal/>`. */
    .replace_all('var(--rrui-modal-padding--horizontal)', 'var(--rrui-modal-padding)')
    .replace_all('var(--rrui-modal-padding--vertical)', 'calc(var(--rrui-modal-padding) - var(--rrui-unit) * 0.5)')
    .replace_all('var(--rrui-modal-padding)', 'calc(0.6rem * 3)')
    .replace_all('var(--rrui-modal-border-radius)', 'var(--rrui-border-radius-big)')
    /* `<Modal/>` colors. */
    .replace_all('var(--rrui-modal-background-color)', 'var(--rrui-card-background-color)')
    .replace_all('var(--rrui-modal-text-color)', 'var(--rrui-card-text-color)')
    .replace_all('var(--rrui-modal-close-button-background-color-focus)', 'var(--rrui-gray-color-lightest)')
    /* `<SlideOutMenu/>` :active. */
    .replace_all('var(--rrui-slide-out-menu-background-color-active)', 'var(--rrui-accent-color)')
    .replace_all('var(--rrui-slide-out-menu-text-color-active)', 'var(--rrui-slide-out-menu-text-color)')
    /* `<SlideOutMenu/>`. */
    .replace_all('var(--rrui-slide-out-menu-background-color)', 'var(--rrui-black-color)')
    .replace_all('var(--rrui-slide-out-menu-text-color)', 'var(--rrui-white-color)')
    /* `<Switcher/>`. */
    .replace_all('var(--rrui-switcher-border-radius)', 'var(--rrui-border-radius-big)')
    /* `<Switcher/>` colors. */
    .replace_all('var(--rrui-switcher-background-color)', 'transparent')
    .replace_all('var(--rrui-switcher-text-color)', 'var(--rrui-accent-color)')
    /* `<Switcher/>` :active. */
    .replace_all('var(--rrui-switcher-background-color-active)', 'var(--rrui-accent-color-light)')
    .replace_all('var(--rrui-switcher-text-color-active)', 'var(--rrui-white-color)')
    /* `<Switcher/>` selected. */
    .replace_all('var(--rrui-switcher-background-color-selected)', 'var(--rrui-accent-color)')
    .replace_all('var(--rrui-switcher-text-color-selected)', 'var(--rrui-white-color)')
    /* `<Tooltip/>`. */
    .replace_all('var(--rrui-tooltip-background-color)', 'var(--rrui-black-color)')
    .replace_all('var(--rrui-tooltip-text-color)', 'var(--rrui-white-color)')
    .replace_all('var(--rrui-tooltip-animation-duration)', '120ms')
    .replace_all('var(--rrui-tooltip-visible-distance)', '0.2em')
    .replace_all('var(--rrui-tooltip-hidden-distance)', '0.5em')
    .replace_all('var(--rrui-tooltip-border-radius)', 'var(--rrui-border-radius-small)')
    /* `<ExpansionPanel/>`. */
    .replace_all('var(--rrui-expansion-panel-header-height)', 'calc(0.6rem * 4)')
    .replace_all('var(--rrui-expansion-panel-header-height-expanded)', 'calc(0.6rem * 5)')
    .replace_all('var(--rrui-expansion-panel-animation-duration)', '210ms')
    .replace_all('var(--rrui-expansion-panel-icon-size)', '0.6rem')
    .replace_all('var(--rrui-expansion-panel-side-padding)', 'calc(0.6rem * 2)')
    .replace_all('var(--rrui-expansion-panel-content-padding-top)', 'calc(0.6rem * 2)')
    .replace_all('var(--rrui-expansion-panel-content-padding-bottom)', 'calc(0.6rem * 2)')
    .replace_all('var(--rrui-expansion-panel-icon-end-border-width)', '1px')
    .replace_all('var(--rrui-expansion-panel-icon-end-border-color-focus)', 'var(--rrui-gray-color-light)')
    .replace_all('var(--rrui-expansion-panel-icon-start-border-bottom-width)', '1px')
    .replace_all('var(--rrui-expansion-panel-icon-start-border-color-focus)', 'var(--rrui-accent-color)')
    .replace_all('var(--rrui-expansion-panel-icon-start-border-color-active)', 'var(--rrui-accent-color-light)')
    /* Card colors. */
    .replace_all('var(--rrui-card-background-color)', 'var(--rrui-white-color)')
    .replace_all('var(--rrui-card-text-color)', 'var(--rrui-black-color)')

    .replace_all('var(--rrui-menu-icon-bar-thickness)', '2px')

    /*--------------*/
    /* Measurements */
    /*--------------*/

    /* Base */
    .replace_all('var(--rrui-unit)', '0.6rem')
    /* Everything */
    .replace_all('var(--rrui-input-height)', 'calc(0.6rem * 3)')
    .replace_all('var(--rrui-fullscreen-input-height)', 'calc(0.6rem * 4)')
      /* `<Select/>`, `<Autocomplete/>` options list side padding. */
    .replace_all('var(--rrui-options-list-negative-side-margin)', 'calc(var(--rrui-list-item-side-padding) - var(--rrui-input-field-side-padding))')
    /* `<TextInput/>`, `<Select/>`, `<Autocomplete/>` input side padding. */
    .replace_all('var(--rrui-input-field-side-padding)', '0rem')
    /* `<TextInput multiline/>` */
    .replace_all('var(--rrui-multiline-text-height)', 'calc(0.6rem * 7)')
    .replace_all('var(--rrui-multiline-text-input-vertical-padding)', '0.6rem')
    /* `<Button/>` */
    .replace_all('var(--rrui-button-side-padding)', '0rem')
    .replace_all('var(--rrui-button-border-width)', '0px')
    .replace_all('var(--rrui-button-border-color)', 'var(--rrui-accent-color)')
    .replace_all('var(--rrui-button-border-radius)', '0rem')
    .replace_all('var(--rrui-button-busy-indicator-width)', '0.1em')
    .replace_all('var(--rrui-button-busy-indicator-bottom)', 'calc(50% - 0.7em)')
    /* `<Select/>` */
    .replace_all('var(--rrui-list-vertical-padding)', '0.6rem')
    .replace_all('var(--rrui-list-item-side-padding)', 'calc(0.6rem * 1.5)')
    .replace_all('var(--rrui-list-item-height)', 'calc(0.6rem * 4)')
    .replace_all('var(--rrui-list-item-icon-margin)', '0.6rem')
    /* `<Select menu/>` */
    .replace_all('var(--rrui-expandable-menu-item-side-padding)', 'var(--rrui-collapsible-menu-item-side-padding)')
    .replace_all('var(--rrui-collapsible-menu-item-side-padding)', 'calc(0.6rem * 2.5)')
    /* `<Snackbar/>` */
    .replace_all('var(--rrui-snackbar-height)', 'calc(0.6rem * 4)')
    .replace_all('var(--rrui-snackbar-side-padding)', 'calc(0.6rem * 1.5)')
    .replace_all('var(--rrui-snackbar-margin)', 'calc(0.6rem * 2)')
    .replace_all('var(--rrui-snackbar-border-radius)', 'var(--rrui-border-radius-small)')
    .replace_all('var(--rrui-snackbar-notifications-count-border-color)', 'currentColor')
    .replace_all('var(--rrui-snackbar-notifications-count-background-color)', 'var(--rrui-snackbar-background-color)')
    .replace_all('var(--rrui-snackbar-notifications-count-size)', '1.4em')
    .replace_all('var(--rrui-snackbar-background-color)', 'var(--rrui-black-color)')
    .replace_all('var(--rrui-snackbar-text-color)', 'var(--rrui-white-color)')
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
      line = line.replace(/calc(.+)calc\(([^)]*)\)(.*);/, 'calc$1($2)$3;')
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
