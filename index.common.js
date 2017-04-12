'use strict'

exports = module.exports = {}

exports.PageAndMenu = require('./build/page and menu').default
exports.Page = require('./build/page').default
exports.CollapsibleMenu = require('./build/menu').default
exports.MenuButton = require('./build/menu button').default
exports.Form = require('./build/form').default
exports.Snackbar = require('./build/snackbar').default
exports.Tooltip = require('./build/tooltip').default
exports.ActivityIndicator = require('./build/activity indicator').default
exports.TextInput = require('./build/text input').default
exports.Select = require('./build/select').default
exports.Button = require('./build/button').default
exports.Switch = require('./build/switch').default
exports.Checkbox = require('./build/checkbox').default
exports.SegmentedControl = require('./build/segmented control').default
exports.DatePicker = require('./build/date picker').default
exports.FileUpload = require('./build/file upload').default
exports.Modal = require('./build/modal').default

// Drag'n'drop
exports.DragAndDrop = require('./build/drag-n-drop').DragAndDrop
exports.CanDrop = require('./build/drag-n-drop').CanDrop
exports.File = require('./build/drag-n-drop').File
exports.FILE = exports.File
exports.Files = require('./build/drag-n-drop').Files
exports.FILES = exports.Files

// exports['default'] = ...