((views) ->
	views.SummaryPieChart  = Backbone.View.extend
		initialize : () ->
			self = this
			this.chart = new Highcharts.Chart 
	            chart: 
	                renderTo: self.options.el
	                plotBackgroundColor: null
	                plotBorderWidth: null
	                plotShadow: false
	                events :
	                	load : self.fetchData self.options.pieType
	            
	            title: 
	                text: self.options.title
	            
	            # tooltip: 
	            #     formatter: () ->
	            #         return '<b>'+ this.point.name +'</b>: '+ this.percentage +' %'
	                
	            
	            plotOptions: 
	                pie: 
	                    allowPointSelect: true
	                    cursor: 'pointer'
	                    dataLabels: 
	                        enabled: false
	                    # showInLegend: true
			return
		render :  ()->
		fetchData : (pieType) ->
    		self = this
    		url = '/getPieSummary/' + pieType
    		$.ajax 
    			url :url,
    			success : (res) ->
    				self.chart.addSeries res["data"]
    				return
    			
    		return
		
	return

)(app.views)