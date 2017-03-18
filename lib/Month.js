'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _dates2 = require('./utils/dates');

var _dates3 = _interopRequireDefault(_dates2);

var _localizer = require('./localizer');

var _localizer2 = _interopRequireDefault(_localizer);

var _chunk = require('lodash/array/chunk');

var _chunk2 = _interopRequireDefault(_chunk);

var _flattenDeep = require('lodash/array/flattenDeep');

var _flattenDeep2 = _interopRequireDefault(_flattenDeep);

var _omit = require('lodash/object/omit');

var _omit2 = _interopRequireDefault(_omit);

var _constants = require('./utils/constants');

var _helpers = require('./utils/helpers');

var _height = require('dom-helpers/query/height');

var _height2 = _interopRequireDefault(_height);

var _position = require('dom-helpers/query/position');

var _position2 = _interopRequireDefault(_position);

var _requestAnimationFrame = require('dom-helpers/util/requestAnimationFrame');

var _requestAnimationFrame2 = _interopRequireDefault(_requestAnimationFrame);

var _EventRow = require('./EventRow');

var _EventRow2 = _interopRequireDefault(_EventRow);

var _EventEndingRow = require('./EventEndingRow');

var _EventEndingRow2 = _interopRequireDefault(_EventEndingRow);

var _Popup = require('./Popup');

var _Popup2 = _interopRequireDefault(_Popup);

var _Overlay = require('react-overlays/lib/Overlay');

var _Overlay2 = _interopRequireDefault(_Overlay);

var _BackgroundCells = require('./BackgroundCells');

var _BackgroundCells2 = _interopRequireDefault(_BackgroundCells);

var _momentTimezone = require('moment-timezone');

var _momentTimezone2 = _interopRequireDefault(_momentTimezone);

var _propTypes = require('./utils/propTypes');

var _eventLevels2 = require('./utils/eventLevels');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var eventsForWeek = function eventsForWeek(evts, start, end, props) {
  return evts.filter(function (e) {
    return (0, _eventLevels2.inRange)(e, start, end, props);
  });
};

var isSegmentInSlot = function isSegmentInSlot(seg, slot) {
  return seg.left <= slot && seg.right >= slot;
};

var propTypes = _extends({}, _EventRow2.default.PropTypes, {

  culture: _react2.default.PropTypes.string,

  date: _react2.default.PropTypes.object,

  min: _react2.default.PropTypes.instanceOf(Date),
  max: _react2.default.PropTypes.instanceOf(Date),

  dateFormat: _propTypes.dateFormat,

  weekdayFormat: _propTypes.dateFormat,

  popup: _react2.default.PropTypes.bool,

  popupOffset: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.number, _react2.default.PropTypes.shape({
    x: _react2.default.PropTypes.number,
    y: _react2.default.PropTypes.number
  })]),

  onSelectEvent: _react2.default.PropTypes.func,
  onSelectSlot: _react2.default.PropTypes.func,
  onSelectDate: _react2.default.PropTypes.func
});

var MonthView = _react2.default.createClass({

  displayName: 'MonthView',

  propTypes: propTypes,

  getInitialState: function getInitialState() {
    return {
      rowLimit: 3,
      needLimitMeasure: true
    };
  },
  componentWillMount: function componentWillMount() {
    this._bgRows = [];
    this._pendingSelection = [];
  },
  componentWillReceiveProps: function componentWillReceiveProps(_ref) {
    var date = _ref.date;

    this.setState({
      needLimitMeasure: !_dates3.default.eq(date, this.props.date)
    });
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    var running = void 0;

    if (this.state.needLimitMeasure) this._measureRowLimit(this.props);

    window.addEventListener('resize', this._resizeListener = function () {
      if (!running) {
        (0, _requestAnimationFrame2.default)(function () {
          running = false;
          _this.setState({ needLimitMeasure: true }); //eslint-disable-line
        });
      }
    }, false);
  },
  componentDidUpdate: function componentDidUpdate() {
    if (this.state.needLimitMeasure) this._measureRowLimit(this.props);
  },
  componentWillUnmount: function componentWillUnmount() {
    window.removeEventListener('resize', this._resizeListener, false);
  },
  getTimezoneDate: function getTimezoneDate(date, timezone) {
    // we need to compensate for big calendar using a local date offset instead of an international one
    var offset = Math.abs((0, _momentTimezone2.default)().local().utcOffset() - (0, _momentTimezone2.default)().tz(timezone).utcOffset());
    var selectedDate = void 0;
    if (offset > 0) {
      selectedDate = (0, _momentTimezone2.default)(date).add(offset, 'minute').toDate();
    } else if (offset === 0) {
      selectedDate = date;
    } else {
      selectedDate = (0, _momentTimezone2.default)(date).subtract(offset, 'minute').toDate();
    }
    return selectedDate;
  },
  render: function render() {
    var _this2 = this;

    var _props = this.props,
        date = _props.date,
        timezone = _props.timezone,
        culture = _props.culture,
        weekdayFormat = _props.weekdayFormat,
        month = _dates3.default.visibleDays(this.getTimezoneDate(date, timezone), culture),
        weeks = (0, _chunk2.default)(month, 7);

    var measure = this.state.needLimitMeasure;

    this._weekCount = weeks.length;

    var elementProps = (0, _omit2.default)(this.props, Object.keys(propTypes));
    var monthEvents = eventsForWeek(this.props.events, month[0], month[month.length - 1], this.props);

    elementProps = _extends({}, elementProps);
    delete elementProps.selectable;
    delete elementProps.timezone;
    delete elementProps.onNavigate;
    delete elementProps.eventPropGetter;
    delete elementProps.onView;
    delete elementProps.views;
    delete elementProps.titleAccessor;
    delete elementProps.allDayAccessor;
    delete elementProps.startAccessor;
    delete elementProps.endAccessor;
    delete elementProps.dayFormat;
    delete elementProps.selectRangeFormat;
    delete elementProps.timeGutterFormat;
    delete elementProps.monthHeaderFormat;
    delete elementProps.dayHeaderFormat;
    delete elementProps.dayRangeHeaderFormat;
    delete elementProps.agendaHeaderFormat;
    delete elementProps.agendaDateFormat;
    delete elementProps.agendaTimeFormat;
    delete elementProps.agendaTimeRangeFormat;
    delete elementProps.formats;
    delete elementProps.events;
    delete elementProps.components;
    delete elementProps.onHeaderClick;
    delete elementProps.defaultDate;
    delete elementProps.eventOffset;
    delete elementProps.onShowMore;
    delete elementProps.eventTimeRangeFormat;

    return _react2.default.createElement(
      'div',
      _extends({}, elementProps, {
        className: (0, _classnames2.default)('rbc-month-view', elementProps.className)
      }),
      _react2.default.createElement(
        'div',
        { className: 'rbc-row rbc-month-header' },
        this._headers(weeks[0], weekdayFormat, culture, monthEvents.length)
      ),
      weeks.map(function (week, idx) {
        return _this2.renderWeek(week, idx, measure && _this2._renderMeasureRows);
      })
    );
  },
  renderWeek: function renderWeek(week, weekIdx, content) {
    var _this3 = this;

    var _endOfRange = (0, _eventLevels2.endOfRange)(week),
        first = _endOfRange.first,
        last = _endOfRange.last;

    var evts = eventsForWeek(this.props.events, week[0], week[week.length - 1], this.props);

    evts.sort(function (a, b) {
      return (0, _eventLevels2.sortEvents)(a, b, _this3.props);
    });

    var segments = evts = evts.map(function (evt) {
      return (0, _eventLevels2.eventSegments)(evt, first, last, _this3.props);
    });
    var limit = this.state.rowLimit - 1 || 1;

    var _eventLevels = (0, _eventLevels2.eventLevels)(segments, limit),
        levels = _eventLevels.levels,
        extra = _eventLevels.extra;

    content = content || function (lvls, wk) {
      return lvls.map(function (lvl, idx) {
        return _this3.renderRowLevel(lvl, wk, idx);
      });
    };

    return _react2.default.createElement(
      'div',
      { key: 'week_' + weekIdx,
        className: 'rbc-month-row',
        ref: !weekIdx && function (r) {
          return _this3._firstRow = r;
        }
      },
      this.renderBackground(week, weekIdx, (0, _flattenDeep2.default)(levels).length + extra.length),
      _react2.default.createElement(
        'div',
        {
          className: 'rbc-row-content'
        },
        _react2.default.createElement(
          'div',
          {
            className: 'rbc-row',
            ref: !weekIdx && function (r) {
              return _this3._firstDateRow = r;
            }
          },
          this._dates(week),
          _react2.default.createElement('div', { className: 'rbc-date-cell total-col', style: (0, _eventLevels2.segStyle)(1, 8) })
        ),
        content(levels, week, weekIdx),
        !!extra.length && this.renderShowMore(segments, extra, week, weekIdx, levels.length)
      ),
      this.props.popup && this._renderOverlay()
    );
  },
  renderBackground: function renderBackground(row, idx, eventsCount) {
    var _this4 = this;

    var self = this;

    function onSelectSlot(_ref2) {
      var start = _ref2.start,
          end = _ref2.end;

      self._pendingSelection = self._pendingSelection.concat(row.slice(start, end + 1));

      clearTimeout(self._selectTimer);
      self._selectTimer = setTimeout(function () {
        return self._selectDates();
      });
    }

    return _react2.default.createElement(_BackgroundCells2.default, {
      container: function container() {
        return (0, _reactDom.findDOMNode)(_this4);
      },
      selectable: this.props.selectable,
      slots: 8,
      ref: function ref(r) {
        return _this4._bgRows[idx] = r;
      },
      onSelectSlot: onSelectSlot,
      row: row,
      eventsCount: eventsCount
    });
  },
  renderRowLevel: function renderRowLevel(segments, week, idx) {
    var _endOfRange2 = (0, _eventLevels2.endOfRange)(week),
        first = _endOfRange2.first,
        last = _endOfRange2.last;

    return _react2.default.createElement(_EventRow2.default, _extends({}, this.props, {
      eventComponent: this.props.components.event,
      onSelect: this._selectEvent,
      key: idx,
      segments: segments,
      start: first,
      end: last
    }));
  },
  renderShowMore: function renderShowMore(segments, extraSegments, week, weekIdx) {
    var _this5 = this;

    var _endOfRange3 = (0, _eventLevels2.endOfRange)(week),
        first = _endOfRange3.first,
        last = _endOfRange3.last;

    var onClick = function onClick(slot) {
      return _this5._showMore(segments, week[slot - 1], weekIdx, slot);
    };

    return _react2.default.createElement(_EventEndingRow2.default, _extends({}, this.props, {
      eventComponent: this.props.components.event,
      onSelect: this._selectEvent,
      onShowMore: onClick,
      key: 'last_row_' + weekIdx,
      segments: extraSegments,
      start: first,
      end: last
    }));
  },
  _dates: function _dates(row) {
    var _this6 = this;

    return row.map(function (day, colIdx) {
      var offRange = _dates3.default.month(day) !== _dates3.default.month(_this6.props.date);

      return _react2.default.createElement(
        'div',
        {
          key: 'header_' + colIdx,
          style: (0, _eventLevels2.segStyle)(1, 8),
          className: (0, _classnames2.default)('rbc-date-cell', {
            'rbc-off-range': offRange,
            'rbc-now': _dates3.default.eq(day, new Date(), 'day'),
            'rbc-current': _dates3.default.eq(day, _this6.props.date, 'day')
          })
        },
        _react2.default.createElement(
          'a',
          { href: '#', onClick: _this6._dateClick.bind(null, day) },
          _localizer2.default.format(day, _this6.props.dateFormat, _this6.props.culture)
        )
      );
    });
  },
  _headers: function _headers(row, format, culture, totalEvents) {
    var first = row[0];
    var last = row[row.length - 1];
    var style = {
      display: 'flex',
      alignItems: 'center',
      flexBasis: '12.5%',
      maxWidth: '12.5%',
      fontSize: '18px'
    };
    var headers = _dates3.default.range(first, last, 'day').map(function (day, idx) {
      return _react2.default.createElement(
        'div',
        {
          key: 'header_' + idx,
          className: 'rbc-header',
          style: style
        },
        _localizer2.default.format(day, format, culture).toUpperCase()
      );
    });
    headers.push(_react2.default.createElement(
      'div',
      {
        key: 'header_7',
        className: 'rbc-header total-col-header',
        style: _extends({}, style, { fontSize: '22px', flexDirection: 'column', whiteSpace: 'initial', textAlign: 'center' })
      },
      _react2.default.createElement(
        'span',
        { style: { color: '#fff' } },
        'PATIENTS',
        _react2.default.createElement('br', null),
        'SCHEDULED'
      ),
      _react2.default.createElement(
        'span',
        { style: { fontWeight: '400' } },
        'Total ',
        totalEvents
      )
    ));

    return headers;
  },
  _renderMeasureRows: function _renderMeasureRows(levels, row, idx) {
    var _this7 = this;

    var first = idx === 0;

    return first ? _react2.default.createElement(
      'div',
      { className: 'rbc-row', ref: function ref(r) {
          return _this7._measureEvent = r;
        } },
      _react2.default.createElement(
        'div',
        { className: 'rbc-row-segment', style: (0, _eventLevels2.segStyle)(1, 8) },
        _react2.default.createElement(
          'div',
          { className: (0, _classnames2.default)('rbc-event') },
          _react2.default.createElement(
            'div',
            { className: 'rbc-event-content' },
            '\xA0'
          )
        )
      )
    ) : _react2.default.createElement('span', null);
  },
  _renderOverlay: function _renderOverlay() {
    var _this8 = this;

    var overlay = this.state && this.state.overlay || {};
    var components = this.props.components;


    return _react2.default.createElement(
      _Overlay2.default,
      {
        rootClose: true,
        placement: 'bottom',
        container: this,
        show: !!overlay.position,
        onHide: function onHide() {
          return _this8.setState({ overlay: null });
        }
      },
      _react2.default.createElement(_Popup2.default, _extends({}, this.props, {
        eventComponent: components.event,
        position: overlay.position,
        events: overlay.events,
        slotStart: overlay.date,
        slotEnd: overlay.end,
        onSelect: this._selectEvent
      }))
    );
  },
  _measureRowLimit: function _measureRowLimit() {
    var eventHeight = (0, _height2.default)(this._measureEvent);
    var labelHeight = (0, _height2.default)(this._firstDateRow);
    var eventSpace = (0, _height2.default)(this._firstRow) - labelHeight;

    this._needLimitMeasure = false;

    this.setState({
      needLimitMeasure: false,
      rowLimit: Math.max(Math.floor(eventSpace / eventHeight), 1)
    });
  },
  _dateClick: function _dateClick(date, e) {
    e.preventDefault();
    this.clearSelection();
    (0, _helpers.notify)(this.props.onSelectDate || this.props.onNavigate, [_constants.navigate.DATE, date]);
  },
  _selectEvent: function _selectEvent() {
    //cancel any pending selections so only the event click goes through.
    this.clearSelection();

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    (0, _helpers.notify)(this.props.onSelectEvent, args);
  },
  _selectDates: function _selectDates() {
    var slots = this._pendingSelection.slice();

    this._pendingSelection = [];

    slots.sort(function (a, b) {
      return +a - +b;
    });

    (0, _helpers.notify)(this.props.onSelectSlot, {
      slots: slots,
      start: slots[0],
      end: slots[slots.length - 1]
    });
  },
  _showMore: function _showMore(segments, date, weekIdx, slot) {
    var cell = (0, _reactDom.findDOMNode)(this._bgRows[weekIdx]).children[slot - 1];

    var events = segments.filter(function (seg) {
      return isSegmentInSlot(seg, slot);
    }).map(function (seg) {
      return seg.event;
    });

    //cancel any pending selections so only the event click goes through.
    this.clearSelection();

    if (this.props.popup) {
      var position = (0, _position2.default)(cell, (0, _reactDom.findDOMNode)(this));

      this.setState({
        overlay: { date: date, events: events, position: position }
      });
    } else {
      (0, _helpers.notify)(this.props.onNavigate, [_constants.navigate.DATE, date]);
    }

    (0, _helpers.notify)(this.props.onShowMore, [events, date]);
  },
  clearSelection: function clearSelection() {
    clearTimeout(this._selectTimer);
    this._pendingSelection = [];
  }
});

MonthView.navigate = function (date, action) {
  switch (action) {
    case _constants.navigate.PREVIOUS:
      return _dates3.default.add(date, -1, 'month');

    case _constants.navigate.NEXT:
      return _dates3.default.add(date, 1, 'month');

    default:
      return date;
  }
};

MonthView.range = function (date, _ref3) {
  var culture = _ref3.culture;

  var start = _dates3.default.firstVisibleDay(date, culture);
  var end = _dates3.default.lastVisibleDay(date, culture);
  return { start: start, end: end };
};

exports.default = MonthView;
module.exports = exports['default'];