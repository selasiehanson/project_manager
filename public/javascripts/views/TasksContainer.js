// Generated by CoffeeScript 1.3.3
(function() {

  (function(views, models, _project) {
    views.TasksContainer = Backbone.View.extend({
      template: _.template($("#tasks-container-tmpl").text()),
      events: {
        'keypress #new_todo': 'createNewTask',
        'click #new_todo': 'clearInput'
      },
      initialize: function() {
        this.collection.on("change", this.change, this);
        return this.collection.on("destroy", this.modelRemoved, this);
      },
      change: function() {
        return this.updatePager();
      },
      clearInput: function(e) {
        var text;
        text = $.trim(this.input.val());
        if (text.toLocaleLowerCase() === "create new task") {
          this.input.val("");
        }
      },
      onClose: function() {
        this.collection.off("change", this.change, this);
        this.collection.off("destroy", this.modelRemoved, this);
      },
      modelRemoved: function() {
        return this.updatePager();
      },
      render: function() {
        var html;
        this.$el.empty();
        html = this.template({});
        this.$el.html(html);
        $('#tasks_container').html(this.el);
        this.updatePager();
        this.updateView();
        this.input = $("#new_todo");
      },
      updateView: function() {
        if (views.tasksView) {
          views.tasksView.onClose();
        }
        views.tasksView = new views.TasksView({
          collection: this.collection
        });
        $("#tasks_view tbody").html(views.tasksView.render().el);
        views.tasksView.renderTasks();
        return $("#tasks_project_header").text(" : " + _project["title"]);
      },
      updatePager: function() {
        var self;
        if (views.tasksPager) {
          views.tasksPager.onClose();
        }
        self = this;
        views.tasksPager = new views.TasksPager({
          collection: self.collection,
          template: "#tasks_pagination-tmpl",
          stats: self.computeStats()
        });
        return $("#tasks_navigation").html(views.tasksPager.render().el);
      },
      computeStats: function() {
        var all, cols, done, remaining, stats, _cols;
        cols = this.collection;
        _cols = this.collection.origModels;
        all = _.select(_cols, function(n) {
          return n.get("status") === "done";
        });
        done = all.length;
        remaining = cols.info().totalRecords - done;
        return stats = {
          remaining: remaining,
          done: done
        };
      },
      createNewTask: function(e) {
        var self, task, text;
        text = this.input.val();
        if (!text || e.keyCode !== 13) {
          return;
        }
        task = new models.Task({
          title: text,
          project: _project.id
        });
        self = this;
        this.collection.close();
        this.collection = new app.collections.TasksCollection();
        task.save({}, {
          success: function(model, res) {
            self.collection.fetch({
              data: {
                projectId: _project.id
              },
              success: function() {
                self.collection.pager();
                self.updateView();
                self.updatePager();
                return self.input.val("");
              }
            });
          },
          error: function(model, res) {}
        });
      }
    });
  })(app.views, app.models, app.project);

}).call(this);
