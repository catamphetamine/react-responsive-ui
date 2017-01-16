// Derived from `react-day-picker` example
// http://react-day-picker.js.org/examples/?overlay

import React, { PureComponent, PropTypes } from 'react';
import DayPicker, { DateUtils } from 'react-day-picker';
import classNames from 'classnames';

import moment from 'moment';

// `date-fns` would be a better alternative to moment
// but it doesn't support templated date parsing
// until version `2.0.0` of it is released.
// https://github.com/date-fns/date-fns/issues/347
// import parseDate from 'date-fns/parse';
// import formatDate from 'date-fns/format';

export default class DatePicker extends PureComponent {

  static propTypes = {
    // `0` means "Sunday", `1` means "Monday", etc.
    // (is `0` by default)
    firstDayOfWeek: PropTypes.number.isRequired,

    // Date format
    // http://momentjs.com/docs/#/displaying/
    // (is `DD/MM/YYYY` by default)
    format: PropTypes.string.isRequired,
    // format: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,

    // Internationalization
    // locale: PropTypes.string,

    // The Date `value`
    value: PropTypes.instanceOf(Date),

    // Writes new `value`
    onChange: PropTypes.func.isRequired,

    // CSS class
    className: PropTypes.string,

    // CSS style object
    style: PropTypes.object
  }

  static defaultProps = {
    format: 'DD/MM/YYYY',
    // locale: 'en-US',
    firstDayOfWeek: 0
  }

  state = {
    showOverlay: false,
    textValue: '',
    selectedDay: null
  };

  constructor(props) {
    super(props);

    if (props.value) {
      this.state.textValue = formatDate(props.value, props.format);
    }

    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputFocus = this.handleInputFocus.bind(this);
    this.handleInputBlur = this.handleInputBlur.bind(this);
    this.handleContainerMouseDown = this.handleContainerMouseDown.bind(this);
  }

  componentWillUnmount() {
    clearTimeout(this.clickTimeout);
  }

  handleContainerMouseDown() {
    this.clickedInside = true;
    // The input's onBlur method is called from a queue right after onMouseDown event.
    // setTimeout adds another callback in the queue, but is called later than onBlur event
    this.clickTimeout = setTimeout(() => {
      this.clickedInside = false;
    }, 0);
  }

  handleInputFocus() {
    this.setState({
      showOverlay: true
    });
  }

  handleInputBlur() {
    const showOverlay = this.clickedInside;

    this.setState({
      showOverlay
    });

    // Force input's focus if blur event was caused by clicking on the calendar
    if (showOverlay) {
      this.input.focus();
    }

    // Let the `onChange` handler fire after this `onBlur`
    // in case when a user clicked a day in the calendar
    // and the `value` is still the old one.
    setTimeout(() => {
      // If an entered date isn't valid then clear the <input/> field
      const { value } = this.props;
      if (!value) {
        this.setState({ textValue: '' });
      }
    }, 0);
  }

  handleInputChange(event) {
    const { value } = event.target;
    const { onChange, format } = this.props;

    const selectedDay = parseDate(value, format);

    if (!selectedDay) {
      onChange(undefined);
      return this.setState({ textValue: value });
    }

    onChange(selectedDay);

    this.setState({
      textValue: value
    }, () => {
      this.daypicker.showMonth(selectedDay);
    });
  }

  handleDayClick(event, selectedDay) {
    const { format, onChange } = this.props;

    onChange(selectedDay);

    this.setState({
      textValue: formatDate(selectedDay, format),
      showOverlay: false
    });

    this.input.blur();
  }

  render() {
    const { format, value, firstDayOfWeek, className, style } = this.props;
    const { textValue, showOverlay } = this.state;

    return (
      <div
        onMouseDown={ this.handleContainerMouseDown }
        className={ classNames('rrui__date-picker', className) }
        style={ style }>

        <input
          type="text"
          ref={ ref => this.input = ref }
          placeholder={ typeof format === 'string' ? format : undefined }
          value={ textValue }
          onChange={ this.handleInputChange }
          onFocus={ this.handleInputFocus }
          onBlur={ this.handleInputBlur }
          className="rrui__date-picker__input"/>

        { showOverlay &&
          <div style={ { position: 'relative' } }>
            {/* <DayPicker/> doesn't support `style` property */}
            <div style={ datePickerContainerStyle }>
              <DayPicker
                ref={ ref => this.daypicker = ref }
                initialMonth={ value }
                firstDayOfWeek={ firstDayOfWeek }
                onDayClick={ this.handleDayClick }
                selectedDays={ day => DateUtils.isSameDay(value, day) }
                className="rrui__date-picker__calendar"/>
            </div>
          </div>
        }
      </div>
    );
  }
}

function parseDate(textValue, format) {
  const momentDay = moment(textValue, format, true);
  if (!momentDay.isValid()) {
    return;
  }
  return momentDay.toDate();
}

function formatDate(date, format) {
  return moment(date).format(format);
}

const datePickerContainerStyle = {
  position: 'absolute',
  zIndex: 1
}

// // Intl date formatting
//
// const dateFormatters = {};
//
// function formatDateIntl(date, locale) {
//   if (typeof Intl === 'undefined') {
//     return date.toISOString();
//   }
//
//   const key = typeof locale === 'string' ? locale : locale.join(',');
//
//   if (!dateFormatters[key]) {
//     dateFormatters[key] = new Intl.DateTimeFormat(locale, {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   }
//
//   return dateFormatters[key];
// }