((views) ->
	views.Dashboard = Backbone.View.extend
		template : _.template($("#dashboard_tmpl").text())
		initialize : () ->

		render : () ->
			this.$el.html this.template()
			return
		updateGraphs : () ->
			bigGraph = new views.SummaryColumnChart 
			
			pieGraph = new views.SummaryPieChart
				el : "projects_summary_pie_chart"
				pieType : "projects"
				title : "Projects Summary"

			pieGraph2 = new views.SummaryPieChart
				el : "tasks_summary_pie_chart"
				pieType : "tasks"
				title : "Tasks Summary"
	return 
)(app.views)