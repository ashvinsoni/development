google.load('visualization', '1', {packages: ['corechart']});
Fantasy.directive('piechart', function() {
        return {
          restrict: 'A',   
          
          link: function($scope, $elm, $attr) {
              setTimeout(function(){                  
              
            // Create the data table.
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Topping');
            data.addColumn('number', 'Slices');      
                        
            var array = JSON.parse($attr.chartdata);             
            data.addRows($scope.chartdataVal2);
            // Set chart options
            var options = {'title':$attr.chtitle,
                            'slices': {0: {color: '#40BEE8'}, 1: {color: '#B38EDB'}},
                           'width':400,
                           'height':300};
            // Instantiate and draw our chart, passing in some options.
            var chart = new google.visualization.PieChart($elm[0]);
            chart.draw(data, options);
            },2000);
          }
      }
    });
    