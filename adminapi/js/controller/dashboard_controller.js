MdApp.controller('DashboardCtrl', function ($scope, commonService, $location) {      
    $scope.filter = '';
    $scope.chartdataVal = [];
    $scope.dashborad= {};
    $scope.dashborad.from_date= "";
    $scope.dashboard_filter = function () {
//        $scope.dashborad.from_date = $("#from_date").val();
       
        var PostData = {filter: $scope.filter};
        commonService.commonApiCall(PostData, 'fantasyadmin/admindashboard/get_dashboard_detail').then(function (response) {
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
    $scope.is_comm_chart = 0;
    $scope.is_entry_fees_chart = 0;
    $scope.is_prize_chart = 0;
    $scope.is_game_chart = 0;
    $scope.get_dashboard_chart = function () {
        
        if($scope.filter == 'custom'){
            //$scope.custom = 0;
            var PostData = {filter: $scope.filter,from_date:$("#from_date").val(),to_date:$("#to_date").val()};
            
        }else{
            //$scope.custom = 1;
            var PostData = {filter: $scope.filter};
        }
       
        commonService.commonApiCall(PostData, 'fantasyadmin/admindashboard/get_dashboard_chart').then(function (response) {
            var games = response.data;
            //------------Game Detail User And Admin -------------------------------------------------            
                $scope.total_game = games.game_detail.total_game;

                $scope.user_game = games.games_chart_user_admin.User;
                $scope.admin_game = games.games_chart_user_admin.Admin;
                $scope.per_user_game = games.game_detail.per_user;
                $scope.per_admin_game = games.game_detail.per_admin;
                var chart = [];
                var keys = Object.keys(games.games_chart_user_admin);
                var log = [];
                log.push('Type');
                log.push('Game');
                chart.push(log);
                keys.forEach(function (key) {
                    log = [];
                    if(games.games_chart_user_admin[key]!=0){
                        log.push(key);
                        log.push(games.games_chart_user_admin[key]);
                        chart.push(log);
                    }
                });
                var color = {0: {color: '#40BEE8'}, 1: {color: '#B38EDB'}};
                $scope.genrateChart(chart,"#,##0.00",color);
                $scope.game_chart_user_admin = $scope.chart;   
            
            //------------Game Detail Public And Private -------------------------------------------------
                $scope.private_game = games.games_chart_public_private.Private;
                $scope.public_game = games.games_chart_public_private.Public;
                $scope.per_private_game = games.game_detail.per_private;
                $scope.per_public_game = games.game_detail.per_public;
                var chart = [];
                var keys = Object.keys(games.games_chart_public_private);
                var log = [];
                log.push('Type');
                log.push('Game');
                chart.push(log);
                keys.forEach(function (key) {
                    log = [];
                    if(games.games_chart_public_private[key]!=0){
                        log.push(key);
                        log.push(games.games_chart_public_private[key]);
                        chart.push(log);
                    }
                });
                var color = {0: {color: '#40BEE8'}, 1: {color: '#B38EDB'}};
                $scope.genrateChart(chart,"#,##0.00",color);
                $scope.game_chart_public_private = $scope.chart; 
                
            //--------------Entry Fees Public And Private - Chart----------------------------
            
                if(games.entry_fee_detail.total_entry_fees){
                    $scope.total_entry_fees = '$'+games.entry_fee_detail.total_entry_fees;
                }else{
                    $scope.total_entry_fees = '$0.00';
                }
                $scope.private_entry_fees = games.entry_fee_detail.public;
                $scope.public_entry_fees = games.entry_fee_detail.private;
                $scope.per_private_entry_fees = games.entry_fee_detail.per_private;
                $scope.per_public_entry_fees = games.entry_fee_detail.per_public;
                var entry_fee_chart = [];
                var keys = Object.keys(games.entry_fee_chart_public_private);
                var log = [];
                log.push('User Type');
                log.push('Entry Fees');
                entry_fee_chart.push(log);
                keys.forEach(function (key) {
                    log = [];
                    if(games.entry_fee_chart_public_private[key]!=0){
                        log.push(key);
                        log.push(games.entry_fee_chart_public_private[key]);
                        entry_fee_chart.push(log);
                    }
                });      
                var color = {0: {color: '#28D0C8'}, 1: {color: '#FF7D81'}};
                $scope.genrateChart(entry_fee_chart,"$ #,##0.00",color);
                $scope.entry_fee_chart_public_private = $scope.chart;

            //--------------Entry Fees User And Admin - Chart----------------------------
            
                $scope.user_entry_fees = games.entry_fee_detail.user;
                $scope.admin_entry_fees = games.entry_fee_detail.admin;
                $scope.per_admin_entry_fees = games.entry_fee_detail.per_admin;
                $scope.per_user_entry_fees = games.entry_fee_detail.per_user;
                var entry_fee_chart = [];
                var keys = Object.keys(games.entry_fee_chart_user_admin);
                var log = [];
                log.push('User Type');
                log.push('Entry Fees');
                entry_fee_chart.push(log);
                keys.forEach(function (key) {
                    log = [];
                    if(games.entry_fee_chart_user_admin[key]!=0){
                        log.push(key);
                        log.push(games.entry_fee_chart_user_admin[key]);
                        entry_fee_chart.push(log);
                    }
                });      
                var color = {0: {color: '#28D0C8'}, 1: {color: '#FF7D81'}};
                $scope.genrateChart(entry_fee_chart,"$ #,##0.00",color);
                $scope.entry_fee_chart_user_admin = $scope.chart;

            
            //--------------Prize detail User And Admin Chart -----------------
                if(games.prize_detail.total_prize){
                   $scope.total_prize = '$'+games.prize_detail.total_prize;
                }else{
                    $scope.total_prize = '$0.00';
                }

                $scope.user_prize = games.prize_detail.user;
                $scope.admin_prize = games.prize_detail.admin;
                $scope.per_admin_prize = games.prize_detail.per_admin;
                $scope.per_user_prize = games.prize_detail.per_user;
                var prize_chart = [];
                var keys = Object.keys(games.prize_chart_user_admin);
                var log = [];
                log.push('User Type');
                log.push('Prize');
                prize_chart.push(log);
                keys.forEach(function (key) {
                    log = [];
                    if(games.prize_chart_user_admin[key]!=0){
                        log.push(key);
                        log.push(games.prize_chart_user_admin[key]);
                        prize_chart.push(log);
                    }
                });
                var color = {0: {color: '#0053A0'}, 1: {color: '#F7D460'}};
                $scope.genrateChart(prize_chart,"$ #,##0.00",color);
                $scope.prize_chart_user_admin = $scope.chart;
                
            //--------------Prize detail Public And Private--------------------------
                
                $scope.private_prize = games.prize_detail.private;
                $scope.public_prize = games.prize_detail.public;
                $scope.per_private_prize = games.prize_detail.per_private;
                $scope.per_public_prize = games.prize_detail.per_public;
                var prize_chart = [];
                var keys = Object.keys(games.prize_chart_public_private);
                var log = [];
                log.push('User Type');
                log.push('Prize');
                prize_chart.push(log);
                keys.forEach(function (key) {
                    log = [];
                    if(games.prize_chart_public_private[key]!=0){
                        log.push(key);
                        log.push(games.prize_chart_public_private[key]);
                        prize_chart.push(log);
                    }
                });
                var color = {0: {color: '#0053A0'}, 1: {color: '#F7D460'}};
                $scope.genrateChart(prize_chart,"$ #,##0.00",color);
                $scope.prize_chart_public_private = $scope.chart;
                
            
            
            //--------------Commission detail Public And Private - Chart ---------------------
            
                $scope.total_comm = games.comm_detail.total_comm;
                $scope.private_comm = games.comm_detail.private;
                $scope.public_comm = games.comm_detail.public;
                $scope.per_private_comm = games.comm_detail.per_private;
                $scope.per_public_comm = games.comm_detail.per_public;
                var comm_chart = [];
                var keys = Object.keys(games.comm_chart_public_private);
                var log = [];
                log.push('User Type');
                log.push('Prize');
                comm_chart.push(log);
                keys.forEach(function (key) {                
                    log = [];
                    if(games.comm_chart_public_private[key]!=0){
                        log.push(key);
                        log.push(games.comm_chart_public_private[key]);
                        comm_chart.push(log);
                    }
                });
                var color = {1: {color: '#28D0C8'}, 0: {color: '#FF7D81'}};
                $scope.genrateDonutChart(comm_chart,"$ #,##0.00",color);
                $scope.comm_chart_public_private = $scope.chart;
                
            //--------------Commission detail User And Admin - Chart ---------------------
            
                $scope.total_comm = games.comm_detail.total_comm;
                $scope.user_comm = games.comm_detail.user;
                $scope.admin_comm = games.comm_detail.admin;
                $scope.per_admin_comm = games.comm_detail.per_admin;
                $scope.per_user_comm = games.comm_detail.per_user;
                var comm_chart = [];
                var keys = Object.keys(games.comm_chart_user_admin);
                var log = [];
                log.push('User Type');
                log.push('Prize');
                comm_chart.push(log);
                keys.forEach(function (key) {                
                    log = [];
                    if(games.comm_chart_user_admin[key]!=0){
                        log.push(key);
                        log.push(games.comm_chart_user_admin[key]);
                        comm_chart.push(log);
                    }
                });
                var color = {1: {color: '#28D0C8'}, 0: {color: '#FF7D81'}};
                $scope.genrateDonutChart(comm_chart,"$ #,##0.00",color);
                $scope.comm_chart_user_admin = $scope.chart;
                
            
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
            var color = {1: {color: '#28D0C8'}, 0: {color: '#FF7D81'}};
            $scope.genrateLineChart(general_chart,"$ #,##0.00",color);
            $scope.general_chart = $scope.chart;
            


        }, function (error) {

        });

    }

    $scope.dashboard_filter();
    
    /*--------------------------------Generate PieChart-------------------------------*/
    
    $scope.genrateChart = function (data,pattern,color) 
    {
        var chart1 = {};
        chart1.type = "PieChart";
        chart1.data = data;
        chart1.options ={
                            displayExactValues: false,
                            width: 458,
                            height: 300,
                            slices: color,    
                            sliceVisibilityThreshold:0
                        };

        chart1.formatters = {
                            number: [{
                                        columnNum: 1,
                                        pattern: pattern
                                    }]
                            };

        $scope.chart = chart1;
    }
  
    /*--------------------------------Generate Donut Chart-------------------------------*/
    
    $scope.genrateDonutChart = function (data,pattern,color) {
        var chart1 = {};
        chart1.type = "PieChart";
        chart1.data = data;
        chart1.options = {
                            displayExactValues: false,
                            width: 458,
                            height: 300,
                            pieHole: 0.9,
                            slices: color,
                            sliceVisibilityThreshold:0
                         };

        chart1.formatters = {
                                number: [{
                                            columnNum: 1,
                                            pattern: pattern
                                        }]
                            };

        $scope.chart = chart1;
    }
    
    /*--------------------------------Generate Line Chart-------------------------------*/
    
    $scope.genrateLineChart = function (data,pattern,color) {
        var chart1 = {};
        chart1.type = "LineChart";
        chart1.data = data;
        chart1.options = {
                            chart: {title: ''},
                            width: 988,
                            height: 400,
                            pointSize: 9,
                            'slices': color,
                            vAxes:[
                                    {title: 'Earning in $', titleTextStyle: {color: '#000000'}, maxValue: 10}, // Left axis
                                    {title: '# Games', titleTextStyle: {color: '#000000'}, maxValue: 20} // Right axis
                                  ],
                            series:[
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
