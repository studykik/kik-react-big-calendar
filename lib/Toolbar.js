'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _createReactClass = require('create-react-class');

var _createReactClass2 = _interopRequireDefault(_createReactClass);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _messages = require('./utils/messages');

var _messages2 = _interopRequireDefault(_messages);

var _constants = require('./utils/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Toolbar = (0, _createReactClass2.default)({
  displayName: 'Toolbar',
  render: function render() {
    var _props = this.props,
        messages = _props.messages,
        label = _props.label;


    messages = (0, _messages2.default)(messages);

    return _react2.default.createElement(
      'div',
      { className: 'rbc-toolbar' },
      _react2.default.createElement(
        'a',
        { href: '#', className: 'btn-prev pull-left', onClick: this.navigate.bind(null, _constants.navigate.PREVIOUS) },
        _react2.default.createElement('i', { className: 'icomoon-arrow_carrot-left' })
      ),
      _react2.default.createElement(
        'span',
        { className: 'month-label' },
        label
      ),
      _react2.default.createElement(
        'a',
        { href: '#', className: 'btn-next pull-right', onClick: this.navigate.bind(null, _constants.navigate.NEXT) },
        _react2.default.createElement('i', { className: 'icomoon-arrow_carrot-right' })
      )
    );
  },
  navigate: function navigate(action) {
    this.props.onNavigate(action);
  },
  view: function view(_view) {
    this.props.onViewChange(_view);
  },
  viewNamesGroup: function viewNamesGroup(messages) {
    var _this = this;

    var viewNames = this.props.views;
    var view = this.props.view;

    if (viewNames.length > 1) {
      return viewNames.map(function (name) {
        return _react2.default.createElement(
          'button',
          { type: 'button', key: name,
            className: (0, _classnames2.default)({ 'rbc-active': view === name }),
            onClick: _this.view.bind(null, name)
          },
          messages[name]
        );
      });
    }
  }
});

exports.default = Toolbar;
module.exports = exports['default'];