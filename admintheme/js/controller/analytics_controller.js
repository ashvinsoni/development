Fantasy.controller('DashboardCtrl', function ($scope, commonService, $location) {      
    $scope.filter = '';
    $scope.chartdataVal = [];
    $scope.dashborad= {};
    $scope.dashborad.from_date= "";
    $scope.dashboard_filter = function () {
//        $scope.dashborad.from_date = $("#from_date").val();
       
        var PostData = {filter: $scope.filter};
        commonService.commonApiCall(PostData, 'admindashboard/get_dashboard_detail').then(function (response) {
            $scope.total_user = response.data.total_user;
            $scope.user_percent = response.data.user_percentage;
            $scope.total_earning = response.data.total_earning;
            $scope.current_earning = response.data.current_earning;
            $scope.total_in_progess = response.data.total_in_progess;
            $scope.in_progress_comm = response.data.in_progress_comm;
            $scope.get_dashboard_chart();
        }, function (error) {

        });
    }
    $scope.custom = 1;
    $scope.chartdataVal2 = [];
    $scope.get_dashboard_chart = function () {
        
        if($scope.filter == 'custom'){
            $scope.custom = 0;
            var PostData = {filter: $scope.filter,from_date:$("#from_date").val(),to_date:$("#to_date").val()};
            
        }else{
            $scope.custom = 1;
            var PostData = {filter: $scope.filter};
        }
       
        commonService.commonApiCall(PostData, 'admindashboard/get_dashboard_chart').then(function (response) {
            var games = response.data;
            //------------Game Detail-----------------------

            $scope.total_game = games.game_detail.total_game;
            $scope.private_game = games.game_detail.private;
            $scope.public_game = games.game_detail.public;
            var chart = [];
            var keys = Object.keys(games.games_chart);
            var log = [];
            log.push('Type');
            log.push('Game');
            chart.push(log);
            keys.forEach(function (key) {
                log = [];
                log.push(key);
                log.push(games.games_chart[key]);
                chart.push(log);
            });
            var color = {0: {color: '#40BEE8'}, 1: {color: '#B38EDB'}};
            $scope.genrateChart(chart,"#,##0.00",color);
            $scope.game_chart = $scope.chart;

            //--------------Entry Fees---------------------------
            $scope.total_entry_fees = games.entry_fee_detail.total_entry_fees;
            $scope.private_entry_fees = games.entry_fee_detail.private;
            $scope.public_entry_fees = games.entry_fee_detail.public;
            var entry_fee_chart = [];
            var keys = Object.keys(games.entry_fee_chart);
            var log = [];
            log.push('User Type');
            log.push('Entry Fees');
            entry_fee_chart.push(log);
            keys.forEach(function (key) {
                log = [];
                log.push(key);
                log.push(games.entry_fee_chart[key]);
                entry_fee_chart.push(log);
            });
            var color = {0: {color: '#28D0C8'}, 1: {color: '#FF7D81'}};
            $scope.genrateChart(entry_fee_chart,"$ #,##0.00",color);
            $scope.entry_fees_chart = $scope.chart;
            
            //--------------Prize detail---------------------------
            $scope.total_prize = games.prize_detail.total_prize;
            $scope.private_prize = games.prize_detail.private;
            $scope.public_prize = games.prize_detail.public;
            var prize_chart = [];
            var keys = Object.keys(games.prize_chart);
            var log = [];
            log.push('User Type');
            log.push('Prize');
            prize_chart.push(log);
            keys.forEach(function (key) {
                log = [];
                log.push(key);
                log.push(games.prize_chart[key]);
                prize_chart.push(log);
            });
            var color = {0: {color: '#0053A0'}, 1: {color: '#F7D460'}};
            $scope.genrateChart(prize_chart,"$ #,##0.00",color);
            $scope.prize_chart = $scope.chart;
            
            //--------------Commission detail---------------------------
            $scope.total_comm = games.comm_detail.total_comm;
            $scope.private_comm = games.comm_detail.private;
            $scope.public_comm = games.comm_detail.public;
            var comm_chart = [];
            var keys = Object.keys(games.comm_chart);
            var log = [];
            log.push('User Type');
            log.push('Prize');
            comm_chart.push(log);
            keys.forEach(function (key) {
                log = [];
                log.push(key);
                log.push(games.comm_chart[key]);
                comm_chart.push(log);
            });
            var color = {1: {color: '#28D0C8'}, 0: {color: '#FF7D81'}};
            $scope.genrateDonutChart(comm_chart,"$ #,##0.00",color);
            $scope.comm_chart = $scope.chart;
            
            //--------------General detail---------------------------
            var general_chart = [];
            var keys = Object.keys(games.general_chart);
            var log = [];
            log.push('Date');
            log.push('Game');
            log.push('Earning');
            general_chart.push(log);
            var object = games.general_chart;
              $.each( object, function( i, dt ) {
                  log = [];
                  log.push(dt.created_date);
                  log.push(parseInt(dt.game));
                  log.push(parseInt(dt.entry_fee));
                  general_chart.push(log);
              });
//            keys.forEach(function (key,value) {
//                console.log(games.general_chart[key]);
//                log = [];
//                log.push(key);
//                log.push(games.general_chart[key]);
//                general_chart.push(log);
//            });
            console.log(general_chart);
            var color = {1: {color: '#28D0C8'}, 0: {color: '#FF7D81'}};
            $scope.genrateLineChart(general_chart,"$ #,##0.00",color);
            $scope.general_chart = $scope.chart;


        }, function (error) {

        });

    }

    $scope.dashboard_filter();

    $scope.genrateChart = function (data,pattern,color) {
        var chart1 = {};
        chart1.type = "PieChart";
        chart1.data = data;
        chart1.options = {
            displayExactValues: true,
            width: 690,
            height: 300,
            is3D: true,
            'slices': color,
            chartArea: {left: 10, top: 10, bottom: 0, height: "100%"}
        };

        chart1.formatters = {
            number: [{
                    columnNum: 1,
                    pattern: pattern
                }]
        };

        $scope.chart = chart1;
    }
  
    $scope.genrateDonutChart = function (data,pattern,color) {
        var chart1 = {};
        chart1.type = "PieChart";
        chart1.data = data;
        chart1.options = {
            displayExactValues: false,
            width: 690,
            height: 300,
            pieHole: 0.9,
            'slices': color,
            chartArea: {left: 10, top: 10, bottom: 0, height: "100%"}
        };

        chart1.formatters = {
            number: [{
                    columnNum: 1,
                    pattern: pattern
                }]
        };

        $scope.chart = chart1;
    }
    
    
    $scope.genrateLineChart = function (data,pattern,color) {
        var chart1 = {};
        chart1.type = "LineChart";

      chart1.data = data;
      console.log(data)
        chart1.options = {
        chart: {
          title: ''
        },
        width: 1400,
        height: 400,
        pointSize: 9,
        'slices': color,
        vAxes:[
        {title: 'Earning in $', titleTextStyle: {color: '#000000'}, maxValue: 10}, // Left axis
        {title: '# Games', titleTextStyle: {color: '#000000'}, maxValue: 20} // Right axis
        ]
        ,series:[
                  {targetAxisIndex:1,color:'#28D0C8'},
                  {targetAxisIndex:0,color:'#FF7D81'}
        ]
        };
      
        chart1.formatters = {
            number: [{
                    columnNum: 2,
                    pattern: '$ #,##0.00'
                }]
        };
        $scope.chart = chart1;
    }
});
