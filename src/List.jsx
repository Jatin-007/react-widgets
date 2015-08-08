import React   from 'react';
import ListOption from './ListOption';
import CustomPropTypes from './util/propTypes';
import compat from './util/compat';
import cn from 'classnames';
import _  from './util/_';

let optionId = (id, idx)=> `${id}__option__${idx}`;

export default React.createClass({

  displayName: 'List',

  mixins: [
    require('./mixins/WidgetMixin'),
    require('./mixins/DataHelpersMixin'),
    require('./mixins/ListMovementMixin'),
    require('./mixins/AriaDescendantMixin')()
  ],

  propTypes: {
    data:          React.PropTypes.array,
    onSelect:      React.PropTypes.func,
    onMove:        React.PropTypes.func,

    optionComponent: CustomPropTypes.elementType,
    itemComponent:   CustomPropTypes.elementType,

    selectedIndex: React.PropTypes.number,
    focusedIndex:  React.PropTypes.number,
    valueField:    React.PropTypes.string,
    textField:     CustomPropTypes.accessor,

    optionID:      React.PropTypes.func,

    messages:      React.PropTypes.shape({
      emptyList:   CustomPropTypes.message
    })
  },


  getDefaultProps(){
    return {
      optID:  '',
      onSelect: ()=>{},
      optionComponent: ListOption,
      ariaActiveDescendantKey: 'list',
      data: [],
      messages: {
        emptyList:   'There are no items in this list'
      }
    }
  },

  componentDidMount(){
    this.move()
  },

  componentDidUpdate(){
    let { data, focused } = this.props
      , idx = data.indexOf(focused)
      , activeId = optionId(this._id(), idx)

    this.ariaActiveDescendant(idx !== -1 ? activeId : null)

    this.move()
  },

  render(){
    var {
        className, role, data
      , focused, selected, messages, onSelect
      , itemComponent: ItemComponent
      , optionComponent: Option
      , optionID
      , ...props  } = this.props
      , id = this._id()
      , items;

    items = !data.length
      ? (
        <li className='rw-list-empty'>
          {_.result(messages.emptyList, this.props)}
        </li>
      ) : data.map((item, idx) => {
          var currentId = optionId(id, idx);

          // if (focused === item)
          //   this._activeID = currentId;

          return (
            <Option
              key={'item_' + idx}
              id={currentId}
              dataItem={item}
              focused={focused === item}
              selected={selected === item}
              onClick={onSelect.bind(null, item)}
            >
              { ItemComponent
                ? <ItemComponent item={item} value={this._dataValue(item)} text={this._dataText(item)}/>
                : this._dataText(item)
              }
            </Option>
          )
        });

    return (
      <ul
        id={id}
        tabIndex='-1'
        className={cn(className, 'rw-list')}
        role={role === undefined ? 'listbox' : role}
        { ...props }
      >
        { items }
      </ul>
    )
  },

  _data(){
    return this.props.data
  },

  move(){
    var list = compat.findDOMNode(this)
      , idx  = this._data().indexOf(this.props.focused)
      , selected = list.children[idx];

    if( !selected ) return

    this.notify('onMove', [ selected, list, this.props.focused ])
  }

})
