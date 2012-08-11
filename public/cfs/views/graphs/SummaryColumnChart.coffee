((views,charts) ->
	views.SummaryColumnChart = Backbone.View.extend
		initialize : () ->
			self = this
			charts.SummaryColumnChart = new Highcharts.Chart
	            chart: 
	                renderTo: 'big_graph_div'
	                type: 'column'
	                events :
	                	load : self.fetchData  
	            title: 
	                text: 'Projects Statistics'
	            subtitle: 
	                text: ''
	            xAxis: 
	                categories:[ 
	                	'Jan'
	                    'Feb'
	                    'Mar'
	                    'Apr'
	                    'May'
	                    'Jun'
	                    'Jul'
	                    'Aug'
	                    'Sep'
	                    'Oct'
	                    'Nov'
	                    'Dec'
	                ]
	            yAxis: 
	                min: 0
	                title:
	                    text: 'Number'
	            
	            legend: 
	                layout: 'vertical'
	                backgroundColor: '#FFFFFF'
	                align: 'left'
	                verticalAlign: 'top'
	                x: 100
	                y: 70
	                floating: true
	                shadow: true
	            
	            # tooltip: 
	            #     formatter: () ->
	            #         return ''+
	            #             this.x +': '+ this.y +' mm'
	             
	            plotOptions: 
	                column: 
	                    pointPadding: 0.2
	                    borderWidth: 0
	            
	        window.ch = this.chart
		render : () ->
		fetchData : () ->
			self = this
			$.ajax 
				url : '/getBigData',
				success : (res) ->
					chart = charts.SummaryColumnChart
					data = res["data"]
					_.each data, (d)=>
            			chart.addSeries d
            			return

					return
				cache : false
	return
)(app.views,app.charts)