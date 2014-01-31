var Table = Datagrid.Table = ComposedView.extend({
  tagName: 'table',

  initialize: function(options) {
    this.options    = options;
    this.collection = this.options.collection;
    this.columns    = this.options.columns;
    this.pager      = this.options.pager;
    this.sorter     = this.options.sorter;
    this.index      = 0;

    this.listenTo(this.collection, 'reset', this.render);
  },

  render: function() {
    this.$el.empty();
    if(this.options && this.options.attributes && this.options.attributes.tableId){
      this.$el.attr("id", this.options.attributes.tableId);
    }
    this.removeNestedViews();

    var header = new Header({columns: this.columns, sorter: this.sorter});
    this.$el.append(header.render().el);
    this.addNestedView(header);

    this.$el.append('<tbody></tbody>');

    if (this.collection.isEmpty()) {
      if(_.isFunction(this.options.emptyCallback)){
        this.options.emptyCallback();
      }else{
        this.$el.append(this.options.emptyMessage);
      } 
    } else {
      this.collection.forEach(this.renderRow, this);
    }

    return this;
  },

  renderRow: function(model) {
    var options = {
      model:      model,
      columns:    this.columns,
      attributes: _.isFunction(this.options.rowAttrs) ? this.options.rowAttrs(model) : this.options.rowAttrs
    };
    var rowClassName;
    if(this.options.rowAttrs && this.options.rowAttrs.evenRowClassName && this.options.rowAttrs.oddRowClassName){
      rowClassName = this.index % 2 === 0 ? this.options.rowAttrs.evenRowClassName : this.options.rowAttrs.oddRowClassName;
    }else{
      rowClassName = this.options.rowClassName;      
    }
    this.index++;
    if (_.isFunction(rowClassName)) {
      rowClassName = rowClassName(model);
    }
    options.className = rowClassName;

    var row = new Row(options);
    this.$('tbody').append(row.render(this.columns).el);
    this.addNestedView(row);
  }
});
