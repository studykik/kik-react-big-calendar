import React from 'react';
import cn from 'classnames';
import message from './utils/messages';
import { navigate } from './utils/constants';

let Toolbar = React.createClass({

  render() {
    let { messages, label } = this.props;

    messages = message(messages)

    return (
      <div className='rbc-toolbar'>
        <a href="#" className="btn-prev pull-left" onClick={this.navigate.bind(null, navigate.PREVIOUS)}>
          <i className="icomoon-arrow_carrot-left"></i>
        </a>

        <span className='month-label'>
          { label }
        </span>

				<a href="#" className="btn-next pull-right" onClick={this.navigate.bind(null, navigate.NEXT)}>
          <i className="icomoon-arrow_carrot-right"></i>
        </a>
      </div>
    );
  },

  navigate(action){
    this.props.onNavigate(action)
  },

  view(view){
    this.props.onViewChange(view)
  },

  viewNamesGroup(messages) {
    let viewNames = this.props.views
    const view = this.props.view

    if (viewNames.length > 1) {
      return (
        viewNames.map(name =>
          <button type='button' key={name}
            className={cn({'rbc-active': view === name})}
            onClick={this.view.bind(null, name)}
          >
            {messages[name]}
          </button>
        )
      )
    }
  }
});

export default Toolbar;
