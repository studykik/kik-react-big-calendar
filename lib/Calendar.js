'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _uncontrollable = require('uncontrollable');

var _uncontrollable2 = _interopRequireDefault(_uncontrollable);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _propTypes3 = require('./utils/propTypes');

var _localizer = require('./localizer');

var _localizer2 = _interopRequireDefault(_localizer);

var _helpers = require('./utils/helpers');

var _constants = require('./utils/constants');

var _dates = require('./utils/dates');

var _dates2 = _interopRequireDefault(_dates);

var _formats = require('./formats');

var _formats2 = _interopRequireDefault(_formats);

var _viewLabel = require('./utils/viewLabel');

var _viewLabel2 = _interopRequireDefault(_viewLabel);

var _move = require('./utils/move');

var _move2 = _interopRequireDefault(_move);

var _Views = require('./Views');

var _Views2 = _interopRequireDefault(_Views);

var _Toolbar = require('./Toolbar');

var _Toolbar2 = _interopRequireDefault(_Toolbar);

var _omit = require('lodash/object/omit');

var _omit2 = _interopRequireDefault(_omit);

var _defaults = require('lodash/object/defaults');

var _defaults2 = _interopRequireDefault(_defaults);

var _transform = require('lodash/object/transform');

var _transform2 = _interopRequireDefault(_transform);

var _mapValues = require('lodash/object/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _momentTimezone = require('moment-timezone');

var _momentTimezone2 = _interopRequireDefault(_momentTimezone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function viewNames(_views) {
  return !Array.isArray(_views) ? Object.keys(_views) : _views;
}

function isValidView(view, _ref) {
  var _views = _ref.views;

  var names = viewNames(_views);
  return names.indexOf(view) !== -1;
}

var now = new _momentTimezone2.default();

/**
 * react-big-calendar is full featured Calendar component for managing events and dates. It uses
 * modern `flexbox` for layout making it super responsive and performant. Leaving most of the layout heavy lifting
 * to the browser. __note:__ The default styles use `height: 100%` which means your container must set an explicit
 * height (feel free to adjust the styles to suit your specific needs).
 *
 * Big Calendar is unopiniated about editing and moving events, prefering to let you implement it in a way that makes
 * the most sense to your app. It also tries not to be prescriptive about your event data structures, just tell it
 * how to find the start and end datetimes and you can pass it whatever you want.
 *
 * One thing to note is that, `react-big-calendar` treats event start/end dates as an _exclusive_ range.
 * which means that the event spans up to, but not including, the end date. In the case
 * of displaying events on whole days, end dates are rounded _up_ to the next day. So an
 * event ending on `Apr 8th 12:00:00 am` will not appear on the 8th, whereas one ending
 * on `Apr 8th 12:01:00 am` will. If you want _inclusive_ ranges consider providing a
 * function `endAccessor` that returns the end date + 1 day for those events that end at midnight.
 */
var Calendar = _react2.default.createClass({
  displayName: 'Calendar',


  propTypes: {
    /**
     * The current date value of the calendar. Determines the visible view range
     *
     * @controllable onNavigate
     */
    date: _propTypes2.default.object,

    /**
     * The current view of the calendar.
     *
     * @default 'month'
     * @controllable onView
     */
    view: _propTypes2.default.string,

    /**
     * markup for additional column (to allow localization).
     *
     *  @default 'PATIENTS <br /> SCHEDULED'
     */
    additionalColumnMarkup: _propTypes2.default.string,

    /**
     * text for Total (to allow localization).
     *
     *  @default 'Total'
     */
    totalString: _propTypes2.default.string,

    /**
     * An array of event objects to display on the calendar
     */
    events: _propTypes2.default.arrayOf(_propTypes2.default.object),

    /**
     * Callback fired when the `date` value changes.
     *
     * @controllable date
     */
    onNavigate: _propTypes2.default.func,

    /**
     * Callback fired when the `view` value changes.
     *
     * @controllable date
     */
    onView: _propTypes2.default.func,

    /**
     * A callback fired when a date selection is made. Only fires when `selectable` is `true`.
     *
     * ```js
     * function(
     *   slotInfo: object {
     *     start: date,
     *     end: date,
     *     slots: array<date>
     *   }
     * )
     * ```
     */
    onSelectSlot: _propTypes2.default.func,

    /**
     * Callback fired when a calendar event is selected.
     *
     * ```js
     * function(event: object)
     * ```
     */
    onSelectEvent: _propTypes2.default.func,

    /**
     * Callback fired when dragging a selection in the Time views.
     *
     * Returning `false` from the handler will prevent a selection.
     *
     * ```js
     * function ({ start: Date, end: Date }) : boolean
     * ```
     */
    onSelectDate: _propTypes2.default.func,

    onSelecting: _propTypes2.default.func,

    /**
     * An array of built-in view names to allow the calendar to display.
     *
     * @type Calendar.views
     * @default ['month', 'week', 'day', 'agenda']
     */
    views: _propTypes3.views,

    /**
     * Determines whether the toolbar is displayed
     */
    toolbar: _propTypes2.default.bool,

    /**
     * Show truncated events in an overlay when you click the "+_x_ more" link.
     */
    popup: _propTypes2.default.bool,

    /**
     * Distance in pixels, from the edges of the viewport, the "show more" overlay should be positioned.
     *
     * ```js
     * <BigCalendar popupOffset={30}/>
     * <BigCalendar popupOffset={{x: 30, y: 20}}/>
     * ```
     */
    popupOffset: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.shape({ x: _propTypes2.default.number, y: _propTypes2.default.number })]),
    /**
     * Allows mouse selection of ranges of dates/times.
     */
    selectable: _propTypes2.default.bool,

    /**
     * Determines the selectable time increments in week and day views
     */
    step: _propTypes2.default.number,

    /**
     * switch the calendar to a `right-to-left` read direction.
     */
    rtl: _propTypes2.default.bool,

    /**
     * Switch the calendar to display in a certain timezone.
     */
    timezone: _propTypes2.default.string,

    /**
     * Optionally provide a function that returns an object of className or style props
     * to be applied to the the event node.
     *
     * ```js
     * function(
     * 	event: object,
     * 	start: date,
     * 	end: date,
     * 	isSelected: bool
     * ) -> { className: string?, style: object? }
     * ```
     */
    eventPropGetter: _propTypes2.default.func,

    /**
     * Accessor for the event title, used to display event information. Should
     * resolve to a `renderable` value.
     *
     * @type {(func|string)}
     */
    titleAccessor: _propTypes3.accessor,

    /**
     * Determines whether the event should be considered an "all day" event and ignore time.
     * Must resolve to a `boolean` value.
     *
     * @type {(func|string)}
     */
    allDayAccessor: _propTypes3.accessor,

    /**
     * The start date/time of the event. Must resolve to a JavaScript `Date` object.
     *
     * @type {(func|string)}
     */
    startAccessor: _propTypes3.accessor,

    /**
     * The end date/time of the event. Must resolve to a JavaScript `Date` object.
     *
     * @type {(func|string)}
     */
    endAccessor: _propTypes3.accessor,

    /**
     * Constrains the minimum _time_ of the Day and Week views.
     */
    min: _propTypes2.default.instanceOf(Date),

    /**
     * Constrains the maximum _time_ of the Day and Week views.
     */
    max: _propTypes2.default.instanceOf(Date),

    /**
     * Determines how far down the scroll pane is initially scrolled down.
     */
    scrollToTime: _propTypes2.default.instanceOf(Date),

    /**
     * Localizer specific formats, tell the Calendar how to format and display dates.
     */
    formats: _propTypes2.default.shape({
      /**
       * Format for the day of the month heading in the Month view.
       */
      dateFormat: _propTypes3.dateFormat,

      /**
       * A day of the week format for Week and Day headings
       */
      dayFormat: _propTypes3.dateFormat,
      /**
       * Week day name format for the Month week day headings.
       */
      weekdayFormat: _propTypes3.dateFormat,

      /**
       * Toolbar header format for the Month view.
       */
      monthHeaderFormat: _propTypes3.dateFormat,
      /**
       * Toolbar header format for the Week views.
       */
      weekHeaderFormat: _propTypes3.dateFormat,
      /**
       * Toolbar header format for the Day view.
       */
      dayHeaderFormat: _propTypes3.dateFormat,

      /**
       * Toolbar header format for the Agenda view.
       */
      agendaHeaderFormat: _propTypes3.dateFormat,

      /**
       * A time range format for selecting time slots.
       */
      selectRangeFormat: _propTypes3.dateFormat,

      agendaDateFormat: _propTypes3.dateFormat,
      agendaTimeFormat: _propTypes3.dateFormat,
      agendaTimeRangeFormat: _propTypes3.dateFormat
    }),

    /**
     * Customize how different sections of the calendar render by providing custom Components.
     * In particular the `Event` component can be specified for the entire calendar, or you can
     * provide an individual component for each view type.
     *
     * ```jsx
     * let components = {
     *   event: MyEvent, // used by each view (Month, Day, Week)
     *   toolbar: MyToolbar,
     *   agenda: {
     *   	 event: MyAgendaEvent // with the agenda view use a different component to render events
     *   }
     * }
     * <Calendar components={components} />
     * ```
     */
    components: _propTypes2.default.shape({
      event: _propTypes3.elementType,

      toolbar: _propTypes3.elementType,

      agenda: _propTypes2.default.shape({
        date: _propTypes3.elementType,
        time: _propTypes3.elementType,
        event: _propTypes3.elementType
      }),

      day: _propTypes2.default.shape({ event: _propTypes3.elementType }),
      week: _propTypes2.default.shape({ event: _propTypes3.elementType }),
      month: _propTypes2.default.shape({ event: _propTypes3.elementType })
    }),

    /**
     * String messages used throughout the component, override to provide localizations
     */
    messages: _propTypes2.default.shape({
      allDay: _propTypes2.default.node,
      previous: _propTypes2.default.node,
      next: _propTypes2.default.node,
      today: _propTypes2.default.node,
      month: _propTypes2.default.node,
      week: _propTypes2.default.node,
      day: _propTypes2.default.node,
      agenda: _propTypes2.default.node,
      showMore: _propTypes2.default.func
    })
  },

  getDefaultProps: function getDefaultProps() {
    return {
      popup: false,
      toolbar: true,
      view: _constants.views.MONTH,
      views: [_constants.views.MONTH, _constants.views.WEEK, _constants.views.DAY, _constants.views.AGENDA],
      date: now,
      step: 30,

      titleAccessor: 'title',
      allDayAccessor: 'allDay',
      startAccessor: 'start',
      endAccessor: 'end'
    };
  },
  componentWillUpdate: function componentWillUpdate(nextProps) {
    var timezone = this.props.timezone;

    if (typeof nextProps.timezone === 'string' && nextProps.timezone !== timezone) {
      _momentTimezone2.default.tz.setDefault(timezone);
      now = (0, _momentTimezone2.default)();
      this.props.date = now;
    }
  },
  getViews: function getViews() {
    var views = this.props.views;

    if (Array.isArray(views)) {
      return (0, _transform2.default)(views, function (obj, name) {
        return obj[name] = _Views2.default[name];
      }, {});
    }

    if ((typeof views === 'undefined' ? 'undefined' : _typeof(views)) === 'object') {
      return (0, _mapValues2.default)(views, function (value, key) {
        if (value === true) {
          return _Views2.default[key];
        }

        return value;
      });
    }

    return _Views2.default;
  },
  getView: function getView() {
    var views = this.getViews();

    return views[this.props.view];
  },
  navigateToToday: function navigateToToday() {
    this._navigate(_constants.navigate.TODAY);
  },
  render: function render() {
    var _props = this.props,
        view = _props.view,
        toolbar = _props.toolbar,
        events = _props.events,
        culture = _props.culture,
        _props$components = _props.components,
        components = _props$components === undefined ? {} : _props$components,
        _props$formats = _props.formats,
        formats = _props$formats === undefined ? {} : _props$formats,
        style = _props.style,
        className = _props.className,
        current = _props.date,
        props = _objectWithoutProperties(_props, ['view', 'toolbar', 'events', 'culture', 'components', 'formats', 'style', 'className', 'date']);

    formats = (0, _formats2.default)(formats);

    var View = this.getView();
    var names = viewNames(this.props.views);

    var elementProps = (0, _omit2.default)(this.props, Object.keys(Calendar.propTypes));

    var viewComponents = (0, _defaults2.default)(components[view] || {}, (0, _omit2.default)(components, names));

    var ToolbarToRender = components.toolbar || _Toolbar2.default;

    elementProps = _extends({}, elementProps);
    delete elementProps.defaultDate;
    delete elementProps.culture;
    delete elementProps.eventOffset;
    delete elementProps.onShowMore;

    return _react2.default.createElement(
      'div',
      _extends({}, elementProps, {
        className: (0, _classnames2.default)('rbc-calendar', className, {
          'rbc-rtl': props.rtl
        }),
        style: style
      }),
      toolbar && _react2.default.createElement(ToolbarToRender, {
        date: current,
        view: view,
        views: names,
        label: (0, _viewLabel2.default)(current, view, formats, culture),
        onViewChange: this._view,
        onNavigate: this._navigate,
        messages: this.props.messages
      }),
      _react2.default.createElement(View, _extends({
        ref: 'view'
      }, props, formats, {
        culture: culture,
        formats: undefined,
        events: events,
        date: current,
        components: viewComponents,
        onNavigate: function onNavigate() {},
        onHeaderClick: this._headerClick,
        onSelectEvent: this._select,
        onSelectSlot: this._selectSlot,
        onSelectDate: this._selectDate,
        onShowMore: this._showMore
      }))
    );
  },
  _navigate: function _navigate(action, newDate) {
    var _props2 = this.props,
        view = _props2.view,
        date = _props2.date,
        onNavigate = _props2.onNavigate;


    date = (0, _move2.default)(action, newDate || date, view);

    onNavigate(date, view);

    if (action === _constants.navigate.DATE) this._viewNavigate(date);
  },
  _viewNavigate: function _viewNavigate(nextDate) {
    var _props3 = this.props,
        view = _props3.view,
        date = _props3.date,
        culture = _props3.culture;


    if (_dates2.default.eq(date, nextDate, view, _localizer2.default.startOfWeek(culture))) {
      this._view(_constants.views.DAY);
    }
  },
  _view: function _view(view) {
    if (view !== this.props.view && isValidView(view, this.props)) this.props.onView(view);
  },
  _select: function _select(event) {
    (0, _helpers.notify)(this.props.onSelectEvent, event);
  },
  _selectSlot: function _selectSlot(slotInfo) {
    (0, _helpers.notify)(this.props.onSelectSlot, slotInfo);
  },
  _selectDate: function _selectDate() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    (0, _helpers.notify)(this.props.onSelectDate, args);
  },
  _headerClick: function _headerClick(date) {
    var view = this.props.view;


    if (view === _constants.views.MONTH || view === _constants.views.WEEK) this._view(_constants.views.day);

    this._navigate(_constants.navigate.DATE, date);
  },
  _showMore: function _showMore(events, date) {
    if (this.props.onShowMore) {
      (0, _helpers.notify)(this.props.onShowMore, [events, date]);
    }
  }
});

exports.default = (0, _uncontrollable2.default)(Calendar, {
  view: 'onView',
  date: 'onNavigate',
  selected: 'onSelectEvent'
});
module.exports = exports['default'];