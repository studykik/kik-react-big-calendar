'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _createReactClass = require('create-react-class');

var _createReactClass2 = _interopRequireDefault(_createReactClass);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _EventRowMixin = require('./EventRowMixin');

var _EventRowMixin2 = _interopRequireDefault(_EventRowMixin);

var _eventLevels = require('./utils/eventLevels');

var _messages = require('./utils/messages');

var _messages2 = _interopRequireDefault(_messages);

var _range = require('lodash/utility/range');

var _range2 = _interopRequireDefault(_range);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isSegmentInSlot = function isSegmentInSlot(seg, slot) {
  return seg.left <= slot && seg.right >= slot;
};
var eventsInSlot = function eventsInSlot(segments, slot) {
  return segments.filter(function (seg) {
    return isSegmentInSlot(seg, slot);
  }).length;
};

var EventRow = (0, _createReactClass2.default)({

  displayName: 'EventRow',

  propTypes: {
    segments: _propTypes2.default.array,
    slots: _propTypes2.default.number
  },

  mixins: [_EventRowMixin2.default],

  render: function render() {
    var _props = this.props,
        segments = _props.segments,
        slotCount = _props.slots;

    var rowSegments = (0, _eventLevels.eventLevels)(segments).levels[0];

    var current = 1,
        lastEnd = 1,
        row = [];

    while (current <= slotCount) {
      var key = '_lvl_' + current;

      var _ref = rowSegments.filter(function (seg) {
        return isSegmentInSlot(seg, current);
      })[0] || {},
          event = _ref.event,
          left = _ref.left,
          right = _ref.right,
          span = _ref.span; //eslint-disable-line

      if (!event) {
        current++;
        continue;
      }

      var gap = Math.max(0, left - lastEnd);

      if (this.canRenderSlotEvent(left, span)) {
        var content = this.renderEvent(event);

        if (gap) row.push(this.renderSpan(gap, key + '_gap'));

        row.push(this.renderSpan(span, key, content));

        lastEnd = current = right + 1;
      } else {
        if (gap) row.push(this.renderSpan(gap, key + '_gap'));

        row.push(this.renderSpan(1, key, this.renderShowMore(segments, current)));
        lastEnd = current = current + 1;
      }
    }

    return _react2.default.createElement(
      'div',
      { className: 'rbc-row' },
      row
    );
  },
  canRenderSlotEvent: function canRenderSlotEvent(slot, span) {
    var segments = this.props.segments;


    return (0, _range2.default)(slot, slot + span).every(function (s) {
      var count = eventsInSlot(segments, s);

      return count === 1;
    });
  },
  renderShowMore: function renderShowMore(segments, slot) {
    var messages = (0, _messages2.default)(this.props.messages);
    var count = eventsInSlot(segments, slot);

    return count ? _react2.default.createElement(
      'a',
      {
        key: 'sm_' + slot,
        className: 'rbc-show-more',
        onClick: this._showMore.bind(null, slot)
      },
      messages.showMore(count)
    ) : false;
  },
  _showMore: function _showMore(slot, e) {
    e.preventDefault();
    this.props.onShowMore(slot);
  }
});

exports.default = EventRow;
module.exports = exports['default'];