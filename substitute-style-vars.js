const fs = require('fs')
const path = require('path')

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

let text = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8')
  /* Base */
  .replace_all('var(--rrui-unit)', '0.6rem')
  /* Everything */
  .replace_all('var(--rrui-input-height)', 'calc(0.6rem * 3)')
  .replace_all('var(--rrui-fullscreen-input-height)', 'calc(0.6rem * 4)')
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
  /* Light Gray is used as `<TextInput/>`, `<Select/>` and `<DatePicker/>` bottom border color. */
  .replace_all('var(--rrui-gray-color-light)', '#cacaca')
  /* Lightest Gray is used as `<Select/>` options hover background color. */
  /* Lightest Gray is used as `<Select/>`'s currently selected option background color. */
  .replace_all('var(--rrui-gray-color-lightest)', '#F3F3F3')
  /* z-index */
  .replace_all('var(--rrui-z-index-overlay)', '100')
  .replace_all('var(--rrui-z-index-above-overlay)', '101')

text = text.slice(text.indexOf('}') + 1)

fs.writeFileSync(path.join(__dirname, 'bundle/style.css'), text)